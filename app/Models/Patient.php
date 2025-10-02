<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $primaryKey = 'patient_id';
    protected $fillable = [
        'patient_fname',
        'patient_lname',
        'patient_mname',
        'gender',
        'birthday',
        'contact_no',
        'address',
        'clinic',
        'parish',
        'classification_cm',
        'category',
        'booklet_no',
        'is_head_family',
        'valid_id_no',
        'endorsed_as_fp',
        'first_time_visit',
        'has_philhealth',
        'philhealth_no',
        'archived',
        'patient_no',
        'patient_code',
    ];

    protected $casts = [
        'birthday' => 'date',
        'is_head_family' => 'boolean',
        'endorsed_as_fp' => 'boolean',
        'first_time_visit' => 'boolean',
        'has_philhealth' => 'boolean',
    ];
}


