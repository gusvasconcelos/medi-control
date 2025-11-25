<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update chat_sessions table
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->string('title')->nullable()->after('user_id');
            $table->dateTime('last_message_at')->nullable()->after('started_at');
            $table->timestamp('updated_at')->nullable()->after('created_at');
            $table->unique('user_id'); // Single session per user
        });

        // Rename messages to chat_messages
        Schema::rename('messages', 'chat_messages');

        // Update chat_messages table
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->jsonb('metadata')->nullable()->after('content');
            $table->timestamp('updated_at')->nullable()->after('created_at');
        });

        // Update role enum to include 'system'
        DB::statement("ALTER TABLE chat_messages DROP CONSTRAINT messages_role_check");
        DB::statement("ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_role_check CHECK (role IN ('user', 'assistant', 'system'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert role enum
        DB::statement("ALTER TABLE chat_messages DROP CONSTRAINT chat_messages_role_check");
        DB::statement("ALTER TABLE chat_messages ADD CONSTRAINT messages_role_check CHECK (role IN ('user', 'assistant'))");

        // Revert chat_messages table
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropColumn(['metadata', 'updated_at']);
        });

        // Rename back to messages
        Schema::rename('chat_messages', 'messages');

        // Revert chat_sessions table
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
            $table->dropColumn(['title', 'last_message_at', 'updated_at']);
        });
    }
};
