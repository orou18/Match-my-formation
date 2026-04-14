<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pathway_video', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pathway_id')->constrained('pathways')->cascadeOnDelete();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['pathway_id', 'video_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pathway_video');
    }
};
