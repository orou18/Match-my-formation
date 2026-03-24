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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            
            // Stockage
            $table->string('url'); // Chemin du fichier (ex: videos/nom_du_fichier.mp4)
            $table->string('thumbnail')->nullable(); // Image d'aperçu
            
            // Organisation
            $table->string('category')->nullable()->index(); // Tourisme, Hôtellerie, etc.
            
            // Système de droits & visibilité
            // 'public' = visible par tous, 'private' = limité aux élèves du partenaire ou groupe spécifique
            $table->enum('visibility', ['public', 'private'])->default('public');
            
            // Relations
            // L'utilisateur qui a uploadé (Admin ou Employé du partenaire)
            $table->foreignId('uploader_id')->nullable()->constrained('users')->onDelete('cascade');
            
            // Si la vidéo appartient à un partenaire spécifique
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            
            // Si la vidéo fait partie d'un module/cours précis
            $table->foreignId('module_id')->nullable()->constrained('modules')->onDelete('set null');
            
            // Ordre d'affichage dans le module
            $table->integer('order')->default(0);

            // Métadonnées
            $table->integer('duration')->nullable(); // Durée en secondes
            $table->bigInteger('views')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};