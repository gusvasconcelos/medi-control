<?php

namespace App\Console\Commands;

use Throwable;
use App\Models\Medication;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportMedicationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'medications:import {file : Caminho para o arquivo (CSV, XLS ou XLSX)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa medicamentos de um arquivo CSV, XLS ou XLSX';

    private int $totalRecords = 0;

    private int $imported = 0;

    private int $skippedAlreadyExists = 0;

    private const MAPPED_FIELDS = [
        'nome_produto' => 'name',
        'principio_ativo' => 'active_principle',
        'empresa_detentora_registro' => 'manufacturer',
        'categoria_regulatoria' => 'category',
        'classe_terapeutica' => 'therapeutic_class',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $filePath = $this->argument('file');

        if (! file_exists($filePath)) {
            $this->error("Arquivo não encontrado: {$filePath}");

            return Command::FAILURE;
        }

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if (! in_array($extension, ['csv', 'xls', 'xlsx'])) {
            $this->error('O arquivo deve ter extensão .csv, .xls ou .xlsx');

            return Command::FAILURE;
        }

        $this->info('Iniciando importação de medicamentos...');

        $this->info("Formato detectado: {$extension}");

        $this->newLine();

        try {
            // Configure CSV reader to handle Windows-1252 encoding (common in Brazilian data)
            if ($extension === 'csv') {
                $reader = IOFactory::createReader('Csv');
                $reader->setInputEncoding('Windows-1252');
                $reader->setDelimiter(';');
                $reader->setEnclosure('"');
                $spreadsheet = $reader->load($filePath);
            } else {
                $spreadsheet = IOFactory::load($filePath);
            }

            $worksheet = $spreadsheet->getActiveSheet();

            $data = $worksheet->toArray();

            if (empty($data)) {
                $this->error('O arquivo está vazio');

                return Command::FAILURE;
            }

            $header = array_map(function ($column) {
                return trim(mb_strtolower($column));
            }, array_first($data));

            $rows = array_slice($data, 1);

            $rowsHydrated = $this->hydrate($header, $rows);

            $this->totalRecords = count($rowsHydrated);

            if ($this->totalRecords === 0) {
                $this->warn('O arquivo não contém dados para importar');

                return Command::SUCCESS;
            }

            $progressBar = $this->output->createProgressBar($this->totalRecords);

            $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');

            $progressBar->setMessage('Processando...');

            $progressBar->start();

            foreach ($rowsHydrated as $row) {
                $exists = Medication::query()
                    ->whereInsensitiveLike('name', $row['name'])
                    ->whereInsensitiveLike('active_principle', $row['active_principle'])
                    ->exists();

                if ($exists) {
                    $this->skippedAlreadyExists++;

                    $progressBar->advance();

                    continue;
                }

                try {
                    Medication::create($row);

                    $this->imported++;
                } catch (Throwable $e) {
                    $progressBar->clear();

                    $this->error("\nErro ao importar medicamento: {$row['name']}");

                    $this->error($e->getMessage());

                    $progressBar->display();
                }

                $progressBar->advance();
            }

            $progressBar->setMessage('Concluído!');

            $progressBar->finish();

            $this->newLine(2);

            $this->displayReport();

            return Command::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Erro ao processar o arquivo: '.$e->getMessage());

            return Command::FAILURE;
        }
    }

    private function hydrate(array $header, array $rows): array
    {
        $hydrated = [];

        $registeredNumbers = [];

        foreach ($rows as $row) {
            $record = collect(array_combine($header, array_map('mb_strtoupper', $row)));

            if (! in_array($record->get('situacao_registro'), ['VÁLIDO', 'ATIVO'])) {
                continue;
            }

            if (stripos($record->get('nome_produto'), 'teste')) {
                continue;
            }

            if (in_array($record->get('numero_registro_produto'), $registeredNumbers)) {
                continue;
            }

            $mapped = [];

            $registeredNumbers[] = $record->get('numero_registro_produto');

            foreach (self::MAPPED_FIELDS as $original => $target) {
                $mapped[$target] = isset($record[$original]) ? trim($record[$original]) : null;
            }

            $hydrated[] = $mapped;
        }

        return $hydrated;
    }

    private function displayReport(): void
    {
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('              RELATÓRIO DE IMPORTAÇÃO                      ');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->newLine();

        $this->table(
            ['Métrica', 'Quantidade'],
            [
                ['Total de registros no arquivo', $this->totalRecords],
                ['✓ Importados com sucesso', "<fg=green>{$this->imported}</>"],
                ['⊗ Ignorados (já existem no banco)', "<fg=yellow>{$this->skippedAlreadyExists}</>"],
            ]
        );

        $this->newLine();

        if ($this->imported > 0) {
            $this->info("✓ {$this->imported} medicamentos foram importados com sucesso!");
        }

        if ($this->imported === 0 && $this->totalRecords > 0) {
            $this->warn('⚠ Nenhum medicamento foi importado. Verifique os critérios de validação.');
        }

        $this->newLine();
    }
}
