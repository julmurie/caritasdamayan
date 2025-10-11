<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'all_is_well',
        'partner_institution_branch',
        'clinic_name',
        'partner_institution_name',
        'parish_name',
        'parish_address',
        'partner_type',
        'patient_surname',
        'patient_firstname',
        'patient_mi',
        'patient_age',
        'patient_address',
        'patient_contact_number',
        'patient_government_id',
        'patient_diagnosis',
        'subtotal_a',
        'subtotal_b',
        'grand_total',
        'total_amount_words',
        'prepared_by',
        'prepared_by_date',
        'approved_by',
        'approved_by_date',
        'received_by_client',
        'received_by_client_date',
        'authorized_representative',
        'authorized_representative_date',
    ];

    public function items()
    {
        return $this->hasMany(MedicineRequestItem::class);
    }

    public function patient()
{
    return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
}


}
