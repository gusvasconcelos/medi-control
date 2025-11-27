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
        Schema::create('user_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('onesignal_player_id')->unique();
            $table->enum('device_type', ['desktop', 'mobile', 'tablet'])->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('device_name')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'active']);
            $table->index('onesignal_player_id');
            $table->index('last_seen_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_devices');
    }
};
