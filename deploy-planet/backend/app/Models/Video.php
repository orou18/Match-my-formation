<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'url',
        'thumbnail',
        'category',
        'visibility',
        'uploader_id',
        'company_id',
        'module_id',
        'duration',
        'views'
    ];

    // Relations
    public function uploader() {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function company() {
        return $this->belongsTo(Company::class);
    }

    public function module() {
        return $this->belongsTo(Module::class);
    }
}