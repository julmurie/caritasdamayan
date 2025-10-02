<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_request_id',
        'unit_cost',
        'qty',
        'packaging',
        'name',
        'dosage',
        'amount',
        'remarks',
    ];

    public function request()
    {
        return $this->belongsTo(MedicineRequest::class);
    }
}
