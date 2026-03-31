<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('avatar');
            $table->text('bio')->nullable()->after('phone');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->json('preferences')->nullable()->after('website');
            $table->json('notification_settings')->nullable()->after('preferences');
            $table->boolean('two_factor_enabled')->default(false)->after('notification_settings');
            $table->string('two_factor_method')->nullable()->after('two_factor_enabled');
            $table->text('two_factor_secret')->nullable()->after('two_factor_method');
            $table->text('two_factor_temp_secret')->nullable()->after('two_factor_secret');
            $table->string('two_factor_code_hash')->nullable()->after('two_factor_temp_secret');
            $table->timestamp('two_factor_code_expires_at')->nullable()->after('two_factor_code_hash');
            $table->timestamp('last_password_change_at')->nullable()->after('two_factor_code_expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'bio',
                'location',
                'website',
                'preferences',
                'notification_settings',
                'two_factor_enabled',
                'two_factor_method',
                'two_factor_secret',
                'two_factor_temp_secret',
                'two_factor_code_hash',
                'two_factor_code_expires_at',
                'last_password_change_at',
            ]);
        });
    }
};
