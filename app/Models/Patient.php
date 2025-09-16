<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $primaryKey = 'patient_id';

    protected $fillable = [
        'cb_by', 'pb_id', 'assessed_by', 'class_id', 'assist_id',
        'patient_lname', 'patient_fname', 'patient_mname',
        'address', 'birthday', 'gender', 'contact_no',
    ];
}
