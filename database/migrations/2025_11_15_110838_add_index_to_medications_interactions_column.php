<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
{
    DB::statement('ALTER TABLE medications ALTER COLUMN interactions TYPE jsonb USING interactions::jsonb');

    DB::statement("CREATE INDEX idx_medications_interactions_gin ON medications USING GIN (interactions jsonb_path_ops)");
    DB::statement("CREATE INDEX idx_interactions_medication_id ON medications USING GIN ((interactions -> 'medications'))");
    DB::statement("CREATE INDEX idx_interactions_classes ON medications USING GIN ((interactions -> 'classes'))");
}

public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_medications_interactions_gin');
        DB::statement('DROP INDEX IF EXISTS idx_interactions_medication_id');
        DB::statement('DROP INDEX IF EXISTS idx_interactions_classes');

        DB::statement('ALTER TABLE medications ALTER COLUMN interactions TYPE json USING interactions::json');
    }
};
