<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    // make soft deletes use archived_at (not deleted_at)
    public const DELETED_AT = 'archived_at';

    protected $fillable = [
        'name',
        'standard_rate',
        'discounted_rate',
    ];

    protected $casts = [
        'standard_rate'   => 'decimal:2',
        'discounted_rate' => 'decimal:2',
        'archived_at'     => 'datetime',
    ];
}
