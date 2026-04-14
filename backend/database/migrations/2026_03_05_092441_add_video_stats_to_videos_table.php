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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $columns = array_filter([
                Schema::hasColumn('videos', 'views') ? 'views' : null,
                Schema::hasColumn('videos', 'likes') ? 'likes' : null,
                Schema::hasColumn('videos', 'comments') ? 'comments' : null,
                Schema::hasColumn('videos', 'shares') ? 'shares' : null,
            ]);

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
