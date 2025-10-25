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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_medication_id')->nullable()->constrained('user_medications')->cascadeOnDelete();
            $table->enum('type', [
                'medication_reminder',
                'low_stock',
                'interaction_alert',
                'system',
            ])->default('system');
            $table->string('title');
            $table->text('body');
            $table->dateTime('scheduled_for');
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('read_at')->nullable();
            $table->enum('provider', ['push', 'whatsapp'])->default('push');
            $table->enum('status', ['pending', 'sent', 'failed', 'read'])->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('scheduled_for');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
