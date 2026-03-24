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
        Schema::create('employee_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('video_id')->constrained('videos')->onDelete('cascade');
            $table->integer('watch_time_seconds')->default(0); // Temps regardé en secondes
            $table->integer('total_duration_seconds')->default(0); // Durée totale de la vidéo
            $table->decimal('progress_percentage', 5, 2)->default(0); // Pourcentage de progression
            $table->boolean('completed')->default(false); // Vidéo terminée
            $table->timestamp('last_watched_at')->nullable(); // Dernier visionnage
            $table->timestamps();
            
            $table->unique(['employee_id', 'video_id']); // Un seul enregistrement par employé/vidéo
            $table->index(['employee_id', 'completed']);
            $table->index(['employee_id', 'progress_percentage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_progress');
    }
};
