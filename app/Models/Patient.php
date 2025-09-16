<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    // If your table is NOT the default "patients", set it here:
    // protected $table = 'patient';

    protected $primaryKey = 'patient_id';
    public $incrementing = true;
    protected $keyType = 'int';

    // app/Models/Patient.php
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
    ];

    protected $casts = [
        'birthday' => 'date',
        'is_head_of_family' => 'boolean',
    ];
}
