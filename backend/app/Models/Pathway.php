<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pathway extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'title',
        'description',
        'domain',
        'duration',
        'duration_hours',
        'price',
        'courses',
        'level',
        'difficulty_level',
        'image',
        'thumbnail',
        'featured',
        'active',
        'is_active',
    ];

    protected $casts = [
        'courses' => 'array',
        'featured' => 'boolean',
        'active' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function videos(): BelongsToMany
    {
        return $this->belongsToMany(Video::class)
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderBy('pathway_video.sort_order');
    }

    public function employeePathways(): HasMany
    {
        return $this->hasMany(EmployeePathway::class);
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_pathways')
            ->withPivot('creator_id', 'assigned_at', 'completed_at', 'progress_percentage', 'is_active')
            ->withTimestamps();
    }
}
