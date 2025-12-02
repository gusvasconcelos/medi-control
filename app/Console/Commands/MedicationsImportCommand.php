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
                /** @var \PhpOffice\PhpSpreadsheet\Reader\Csv $reader */
                $reader = IOFactory::createReader('Csv');
                $reader->setInputEncoding('Windows-1252');
                $reader->setDelimiter(';');
                $reader->setEnclosure('"');
                $spreadsheet = $reader->load($filePath);
            } else {
                $spreadsheet = IOFactory::load($filePath);
            }

            $worksheet = $spreadsheet->getActiveSheet();

            $headerRow = $worksheet->getRowIterator()->current();
            $header = [];
            foreach ($headerRow->getCellIterator() as $cell) {
                $header[] = trim(mb_strtolower($cell->getValue()));
            }

            if (empty($header)) {
                $this->error('The file is empty');

                return Command::FAILURE;
            }

            $this->info('Loading existing medications from database...');

            $existingRegistrationNumbers = Medication::query()
                ->pluck('registration_number')
                ->flip()
                ->toArray();

            $rowsHydrated = $this->hydrateFromIterator($worksheet, $header, $existingRegistrationNumbers);

            $this->totalRecords = count($rowsHydrated);

            if ($this->totalRecords === 0) {
                $this->warn('The file does not contain data to import');

                return Command::SUCCESS;
            }

            $progressBar = $this->output->createProgressBar($this->totalRecords);

            $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');

            $progressBar->setMessage('Inserting into database...');

            $progressBar->start();

            $rowsHydratedChunked = array_chunk($rowsHydrated, 1000);

            foreach ($rowsHydratedChunked as $chunk) {
                if (!empty($chunk)) {
                    Medication::insert($chunk);
                    $this->imported += count($chunk);
                    $progressBar->advance(count($chunk));
                }
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

    /**
     * Hydrate the rows from the worksheet using RowIterator.
     */
    private function hydrateFromIterator($worksheet, array $header, array $existingRegistrationNumbers): array
    {
        $hydrated = [];
        $registeredNumbers = [];

        $rowIterator = $worksheet->getRowIterator();
        $rowIterator->next();

        while ($rowIterator->valid()) {
            $row = $rowIterator->current();
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);

            $rowData = [];
            foreach ($cellIterator as $cell) {
                $rowData[] = $cell->getValue();
            }

            $rowData = array_slice(array_pad($rowData, count($header), null), 0, count($header));

            $record = array_combine($header, array_map('mb_strtoupper', $rowData));

            if (
                !isset($record['numero_registro_produto'])
                || trim($record['numero_registro_produto']) === ''
            ) {
                $rowIterator->next();
                continue;
            }

            if (
                !isset($record['situacao_registro'])
                || !in_array($record['situacao_registro'], ['VÁLIDO', 'ATIVO'], true)
            ) {
                $rowIterator->next();
                continue;
            }

            if (
                isset($record['nome_produto'])
                && stripos($record['nome_produto'], 'teste') !== false
            ) {
                $rowIterator->next();
                continue;
            }

            $regNumber = $record['numero_registro_produto'];

            if (isset($registeredNumbers[$regNumber])) {
                $rowIterator->next();
                continue;
            }

            if (isset($existingRegistrationNumbers[$regNumber])) {
                $this->skippedAlreadyExists++;
                $rowIterator->next();
                continue;
            }

            $registeredNumbers[$regNumber] = true;

            $mapped = [];
            foreach (self::MAPPED_FIELDS as $original => $target) {
                $mapped[$target] = isset($record[$original]) ? trim($record[$original]) : null;
            }

            $hydrated[] = $mapped;
            $rowIterator->next();
        }

        return $hydrated;
    }

    private function displayReport(): void
    {
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('                        IMPORT REPORT                      ');
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
