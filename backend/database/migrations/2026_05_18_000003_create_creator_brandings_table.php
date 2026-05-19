<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creator_brandings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('company_name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('primary_color')->default('#007A7A');
            $table->string('secondary_color')->default('#004D40');
            $table->string('accent_color')->default('#FFB800');
            $table->string('logo_url')->nullable();
            $table->string('favicon_url')->nullable();
            $table->string('font_family')->default('Inter');
            $table->text('custom_css')->nullable();
            $table->string('theme')->default('default');
            $table->boolean('show_branding')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creator_brandings');
    }
};
