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
        Schema::create('medication_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('medications')->restrictOnDelete();
            $table->foreignId('related_id')->constrained('medications')->restrictOnDelete();
            $table->enum('severity', ['none', 'mild', 'moderate', 'severe'])->default('none');
            $table->text('description');
            $table->text('recommendation')->nullable();
            $table->dateTime('detected_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();

            $table->index('owner_id');
            $table->index('related_id');
            $table->index('severity');
            $table->index('detected_at');
            $table->index(['owner_id', 'related_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_interactions');
    }
};
