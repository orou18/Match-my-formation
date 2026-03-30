<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'source_type',
        'url',
        'external_url',
        'provider',
        'storage_disk',
        'thumbnail',
        'category',
        'visibility',
        'allow_comments',
        'uploader_id',
        'company_id',
        'module_id',
        'duration',
        'views',
        'likes',
        'comments',
        'shares',
        'published_at',
        'order',
    ];

    protected $casts = [
        'allow_comments' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'video_url',
        'thumbnail_url',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function pathways(): BelongsToMany
    {
        return $this->belongsToMany(Pathway::class)
            ->withPivot('sort_order')
            ->withTimestamps();
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(VideoLike::class);
    }

    public function getVideoUrlAttribute(): ?string
    {
        if ($this->source_type === 'external') {
            return $this->external_url;
        }

        if (!$this->url) {
            return null;
        }

        return Storage::disk($this->storage_disk ?: 'public')->url($this->url);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }

        if (str_starts_with($this->thumbnail, 'http://') || str_starts_with($this->thumbnail, 'https://') || str_starts_with($this->thumbnail, '/')) {
            return $this->thumbnail;
        }

        return Storage::disk('public')->url($this->thumbnail);
    }
}
