<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    public const DELETED_AT = 'archived_at';

    protected $fillable = [
        'name',
        'standard_price',
        'discounted_price',
    ];

    protected $casts = [
        'standard_price'   => 'decimal:2',
        'discounted_price' => 'decimal:2',
        'archived_at'       => 'datetime',
    ];
}
