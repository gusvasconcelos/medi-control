<?php

namespace App\Console\Commands;

use Throwable;
use App\Models\Medication;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MedicationsImportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'medications:import {file : Path to the file (CSV, XLS or XLSX)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import medicaments from a CSV, XLS or XLSX file';

    private int $totalRecords = 0;

    private int $imported = 0;

    private int $skippedAlreadyExists = 0;

    private const MAPPED_FIELDS = [
        'nome_produto' => 'name',
        'principio_ativo' => 'active_principle',
        'empresa_detentora_registro' => 'manufacturer',
        'categoria_regulatoria' => 'category',
        'classe_terapeutica' => 'therapeutic_class',
        'numero_registro_produto' => 'registration_number',
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $filePath = $this->argument('file');

        if (! file_exists($filePath)) {
            $this->error("File not found: {$filePath}");

            return Command::FAILURE;
        }

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if (! in_array($extension, ['csv', 'xls', 'xlsx'])) {
            $this->error('The file must have a .csv, .xls or .xlsx extension');

            return Command::FAILURE;
        }

        $this->info('Starting medication import...');

        $this->info("Detected format: {$extension}");

        $this->newLine();

        try {
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
                $this->error('The file is empty');

                return Command::FAILURE;
            }

            $header = array_map(function ($column) {
                return trim(mb_strtolower($column));
            }, array_first($data));

            $rows = array_slice($data, 1);

            $rowsHydrated = $this->hydrate($header, $rows);

            $this->totalRecords = count($rowsHydrated);

            if ($this->totalRecords === 0) {
                $this->warn('The file does not contain data to import');

                return Command::SUCCESS;
            }

            $progressBar = $this->output->createProgressBar($this->totalRecords);

            $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');

            $progressBar->setMessage('Processing...');

            $progressBar->start();

            foreach ($rowsHydrated as $row) {
                $exists = Medication::query()
                    ->where('registration_number', $row['registration_number'])
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

                    $this->error("\nError importing medication: {$row['name']}");

                    $this->error($e->getMessage());

                    $progressBar->display();
                }

                $progressBar->advance();
            }

            $progressBar->setMessage('Completed!');

            $progressBar->finish();

            $this->newLine(2);

            $this->displayReport();

            return Command::SUCCESS;
        } catch (Throwable $e) {
            $this->error('Error processing the file: '.$e->getMessage());

            return Command::FAILURE;
        }
    }

    private function hydrate(array $header, array $rows): array
    {


        $hydrated = [];

        $registeredNumbers = [];

        foreach ($rows as $row) {
            $record = collect(array_combine($header, array_map('mb_strtoupper', $row)));

            if (
                is_null($record->get('numero_registro_produto'))
                || trim($record->get('numero_registro_produto')) === ''
            ) {
                continue;
            }

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
        $this->info('              IMPORT REPORT                      ');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->newLine();

        $this->table(
            ['Metric', 'Quantity'],
            [
                ['Total records in the file', $this->totalRecords],
                ['✓ Imported successfully', "<fg=green>{$this->imported}</>"],
                ['⊗ Ignored (already exist in the database)', "<fg=yellow>{$this->skippedAlreadyExists}</>"],
            ]
        );

        $this->newLine();

        if ($this->imported > 0) {
            $this->info("✓ {$this->imported} medications were imported successfully!");
        }

        if ($this->imported === 0 && $this->totalRecords > 0) {
            $this->warn('⚠ No medication was imported. Verify the validation criteria.');
        }

        $this->newLine();
    }
}
