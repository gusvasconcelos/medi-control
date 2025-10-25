<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('caregiver_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caregiver_patient_id')->constrained('caregiver_patient')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            // Constraints
            $table->unique(['caregiver_patient_id', 'permission_id'], 'caregiver_permission_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caregiver_permissions');
    }
};
