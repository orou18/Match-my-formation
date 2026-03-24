<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePathway extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'pathway_id',
        'creator_id',
        'assigned_at',
        'completed_at',
        'progress_percentage',
        'is_active',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
        'progress_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Relation avec l'employé
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Relation avec le parcours
     */
    public function pathway(): BelongsTo
    {
        return $this->belongsTo(Pathway::class);
    }

    /**
     * Relation avec le créateur
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Vérifier si le parcours est terminé
     */
    public function isCompleted(): bool
    {
        return $this->progress_percentage >= 90;
    }

    /**
     * Mettre à jour la progression du parcours
     */
    public function updateProgress(float $percentage): void
    {
        $this->progress_percentage = min($percentage, 100);
        
        if ($this->progress_percentage >= 90 && !$this->completed_at) {
            $this->completed_at = now();
        }
        
        $this->save();
    }
}
