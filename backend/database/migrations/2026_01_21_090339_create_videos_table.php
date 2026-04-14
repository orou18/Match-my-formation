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

            // Stockage & source vidéo
            $table->enum('source_type', ['upload', 'external'])->default('upload');
            $table->string('url')->nullable(); // chemin local/S3 pour upload
            $table->string('external_url')->nullable(); // YouTube/Vimeo/etc.
            $table->string('provider')->nullable(); // youtube, vimeo, direct
            $table->string('storage_disk')->nullable()->default('public');
            $table->string('thumbnail')->nullable();

            // Organisation
            $table->string('category')->nullable()->index();

            // Droits & visibilité
            $table->enum('visibility', ['public', 'private', 'unlisted'])->default('public');
            $table->boolean('allow_comments')->default(true);

            // Relations
            $table->foreignId('uploader_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained('modules')->onDelete('set null');
            $table->integer('order')->default(0);

            // Métadonnées
            $table->integer('duration')->nullable();
            $table->bigInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->unsignedInteger('comments')->default(0);
            $table->unsignedInteger('shares')->default(0);
            $table->timestamp('published_at')->nullable();

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
