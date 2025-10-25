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
        Schema::create('adherence_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('total_scheduled')->default(0);
            $table->integer('total_taken')->default(0);
            $table->decimal('adherence_rate', 5, 2)->default(0.00); // percentual de adesão
            $table->dateTime('generated_at')->useCurrent();
            $table->string('file_path')->nullable(); // PDF gerado
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('user_id');
            $table->index(['user_id', 'generated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adherence_reports');
    }
};
