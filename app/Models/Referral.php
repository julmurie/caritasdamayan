<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'ref_control_no',
        'issuing_program_cia',
        'issuing_program_gen129',
        'issuing_program_alliswell',
        'other_programs',
        'referred_to',
        'client_name',
        'diagnosis',
        'contact_no',
        'address',
        'parish_name',
        'diocese',
        'partner_type',
        'fp_booklet_no',
        'valid_id_presented',
        'initial_provided',
        'documents_other',
        'assistance',
        'documents',
    ];

    protected $casts = [
        'date' => 'date',
        'issuing_program_cia' => 'boolean',
        'issuing_program_gen129' => 'boolean',
        'issuing_program_alliswell' => 'boolean',
        'assistance' => 'array',
        'documents' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
