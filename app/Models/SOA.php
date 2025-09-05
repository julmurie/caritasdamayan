<?php

// app/Models/Soa.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Soa extends Model
{
    use SoftDeletes;

    protected $table = 'soa'; // <-- singular table

    protected $fillable = [
        'number','soa_date','cover_period','charge_slip',
        'total_amount','attachment','status',
    ];

    protected $casts = [
        'soa_date' => 'date',
        'total_amount' => 'decimal:2',
    ];
}
