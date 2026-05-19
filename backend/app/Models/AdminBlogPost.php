<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminBlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'author',
        'category',
        'tags',
        'status',
        'published_at',
        'views',
        'likes',
        'comments',
        'featured',
        'thumbnail',
        'created_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'featured' => 'boolean',
        'published_at' => 'datetime',
    ];
}
