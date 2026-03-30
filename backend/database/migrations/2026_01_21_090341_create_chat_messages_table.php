<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete();
            $table->text('message');
            $table->boolean('is_question')->default(false);
            $table->enum('status', ['pending', 'answered', 'resolved'])->default('pending');
            $table->foreignId('reply_to')->nullable()->constrained('chat_messages')->cascadeOnDelete();
            $table->unsignedInteger('likes_count')->default(0);
            $table->timestamps();

            $table->index(['video_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
