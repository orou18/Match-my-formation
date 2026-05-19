<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorBranding extends Model
{
    protected $fillable = [
        'creator_id',
        'company_name',
        'tagline',
        'primary_color',
        'secondary_color',
        'accent_color',
        'logo_url',
        'favicon_url',
        'font_family',
        'custom_css',
        'theme',
        'show_branding',
    ];

    protected $casts = [
        'show_branding' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
