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
        Schema::table('videos', function (Blueprint $table) {
            if (!Schema::hasColumn('videos', 'views')) {
                $table->integer('views')->default(0)->after('url');
            }
            if (!Schema::hasColumn('videos', 'likes')) {
                $table->integer('likes')->default(0)->after('views');
            }
            if (!Schema::hasColumn('videos', 'comments')) {
                $table->integer('comments')->default(0)->after('likes');
            }
            if (!Schema::hasColumn('videos', 'shares')) {
                $table->integer('shares')->default(0)->after('comments');
            }
            if (!Schema::hasColumn('videos', 'duration')) {
                $table->string('duration')->nullable()->after('shares');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['views', 'likes', 'comments', 'shares', 'duration', 'thumbnail']);
        });
    }
};
