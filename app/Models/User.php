<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    // ⬇️ Add HasApiTokens
    use HasApiTokens, HasFactory, Notifiable,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'role',
        'firstname',
        'lastname',
        'email',
        'password',
        'job_description',
        'branch_name',
        'merchant_type',
        'is_active',
        // if you add archive later:
        // 'archived_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string,string>
     */
    protected $casts = [
    'email_verified_at' => 'datetime',
    'password'          => 'hashed',
    'is_active'         => 'boolean',
    'locked_until'      => 'datetime',
];

    /**
     * Accessor for full name.
     */
    public function getNameAttribute(): string
    {
        return trim("{$this->firstname} {$this->lastname}");
    }
}
