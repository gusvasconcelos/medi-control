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

    private int $skippedTestName = 0;

    private int $skippedInvalidStatus = 0;

    private int $skippedDuplicateInCsv = 0;

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
            $spreadsheet = IOFactory::load($filePath);

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

            dd($rowsHydrated);

            if ($header !== self::EXPECTED_COLUMNS) {
                $this->error('O arquivo não possui as colunas esperadas.');

                $this->info('Colunas esperadas: '.implode(', ', self::EXPECTED_COLUMNS));

                $this->info('Colunas encontradas: '.implode(', ', $header));

                return Command::FAILURE;
            }

            $this->totalRecords = count($rows);

            if ($this->totalRecords === 0) {
                $this->warn('O arquivo não contém dados para importar');

                return Command::SUCCESS;
            }

            $progressBar = $this->output->createProgressBar($this->totalRecords);

            $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');

            $progressBar->setMessage('Processando...');

            $progressBar->start();

            $registrationNumbers = [];

            foreach ($rows as $row) {
                $record = array_combine($header, $row);

                if (empty(trim($record['NOME_PRODUTO'] ?? ''))) {
                    $progressBar->advance();

                    continue;
                }

                $situacao = trim($record['SITUACAO_REGISTRO'] ?? '');

                if (in_array($situacao, ['VÁLIDO', 'ATIVO'])) {
                    $this->skippedInvalidStatus++;

                    $progressBar->advance();

                    continue;
                }

                if (stripos($record['NOME_PRODUTO'], 'teste')) {
                    $this->skippedTestName++;

                    $progressBar->advance();

                    continue;
                }

                $registrationNumber = trim($record['NUMERO_REGISTRO_PRODUTO'] ?? '');

                if (isset($registrationNumbers[$registrationNumber])) {
                    $this->skippedDuplicateInCsv++;

                    $progressBar->advance();

                    continue;
                }

                $registrationNumbers[$registrationNumber] = true;



                $medicationData = [
                    'name' => trim($record['NOME_PRODUTO']),
                    'active_principle' => trim($record['PRINCIPIO_ATIVO']),
                    'manufacturer' => ! empty(trim($record['EMPRESA_DETENTORA_REGISTRO'])) ? trim($record['EMPRESA_DETENTORA_REGISTRO']) : null,
                    'category' => ! empty(trim($record['CATEGORIA_REGULATORIA'])) ? trim($record['CATEGORIA_REGULATORIA']) : null,
                    'therapeutic_class' => ! empty(trim($record['CLASSE_TERAPEUTICA'])) ? trim($record['CLASSE_TERAPEUTICA']) : null,
                ];

                $exists = Medication::where('name', $medicationData['name'])
                    ->where('active_principle', $medicationData['active_principle'])
                    ->exists();

                if ($exists) {
                    $this->skippedAlreadyExists++;
                    $progressBar->advance();

                    continue;
                }

                // Inserir medicamento
                try {
                    Medication::create($medicationData);
                    $this->imported++;
                } catch (\Exception $e) {
                    $progressBar->clear();
                    $this->error("\nErro ao importar medicamento: {$medicationData['name']}");
                    $this->error($e->getMessage());
                    $progressBar->display();
                }

                $progressBar->advance();
            }

            $progressBar->setMessage('Concluído!');

            $progressBar->finish();

            $this->newLine(2);

            // Exibir relatório
            $this->displayReport();

            return Command::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Erro ao processar o arquivo: '.$e->getMessage());

            return Command::FAILURE;
        }
    }

    private function hydrate(array $header, array $rows): array
    {
        foreach ($rows as $row) {
            $record = array_combine(array_values($header), $row);

            dd($record);
        }

        return [];
    }

    /**
     * Exibe o relatório da importação
     */
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
                ['⊗ Ignorados (contêm "teste")', "<fg=yellow>{$this->skippedTestName}</>"],
                ['⊗ Ignorados (situação inválida)', "<fg=yellow>{$this->skippedInvalidStatus}</>"],
                ['⊗ Ignorados (duplicatas no arquivo)', "<fg=yellow>{$this->skippedDuplicateInCsv}</>"],
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
