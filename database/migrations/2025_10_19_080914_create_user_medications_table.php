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
        Schema::create('user_medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('medication_id')->constrained('medications')->restrictOnDelete();
            $table->string('dosage');
            $table->string('frequency');
            $table->json('time_slots');
            $table->enum('via_administration', [
                'oral',
                'topical',
                'injection',
                'inhalation',
                'sublingual',
                'rectal',
                'other',
            ])->default('oral');
            $table->integer('duration')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('initial_stock')->default(0);
            $table->integer('current_stock')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'active']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_medications');
    }
};
