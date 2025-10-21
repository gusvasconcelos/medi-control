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
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('active_principle', 1000)->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('category')->nullable();
            $table->string('therapeutic_class')->nullable();
            $table->string('strength')->nullable(); // ex: "500mg", "10mg/ml"
            $table->enum('form', [
                'tablet',
                'capsule',
                'liquid',
                'injection',
                'cream',
                'drops',
                'spray',
                'inhaler',
                'patch',
                'other',
            ])->nullable();
            $table->text('description')->nullable();
            $table->text('warnings')->nullable();
            $table->json('interactions')->nullable();
            $table->timestamps();

            $table->index('name');
            $table->index('active_principle');
            $table->index('category');
            $table->index('therapeutic_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
