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
        Schema::create('side_effects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_medication_id')->constrained('user_medications')->cascadeOnDelete();
            $table->string('symptom');
            $table->enum('severity', ['mild', 'moderate', 'severe'])->default('mild');
            $table->dateTime('reported_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('user_medication_id');
            $table->index('reported_at');
            $table->index('severity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('side_effects');
    }
};
