<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PostgreSQL requires using raw SQL to modify enums
        DB::statement("ALTER TABLE notifications DROP CONSTRAINT notifications_status_check");
        DB::statement("ALTER TABLE notifications ADD CONSTRAINT notifications_status_check CHECK (status IN ('pending', 'sent', 'failed', 'read', 'expired'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert expired notifications back to failed before removing the constraint
        DB::table('notifications')->where('status', 'expired')->update(['status' => 'failed']);

        DB::statement("ALTER TABLE notifications DROP CONSTRAINT notifications_status_check");
        DB::statement("ALTER TABLE notifications ADD CONSTRAINT notifications_status_check CHECK (status IN ('pending', 'sent', 'failed', 'read'))");
    }
};
