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
        Schema::create('interaction_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('medication_1_id')->constrained('medications')->restrictOnDelete();
            $table->foreignId('medication_2_id')->constrained('medications')->restrictOnDelete();
            $table->enum('severity', ['mild', 'moderate', 'severe', 'contraindicated'])->default('moderate');
            $table->text('description');
            $table->text('recommendation')->nullable();
            $table->dateTime('detected_at')->useCurrent();
            $table->dateTime('acknowledged_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'acknowledged_at']);
            $table->index('severity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interaction_alerts');
    }
};
