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
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('started_at')->useCurrent();
            $table->dateTime('ended_at')->nullable();
            $table->dateTime('expires_at'); // Sessão expira após 24h de inatividade
            $table->enum('context_type', [
                'general',
                'medication',
                'interaction',
                'symptom',
                'other',
            ])->default('general');
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('user_id');
            $table->index('expires_at'); // Para limpeza automática
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
