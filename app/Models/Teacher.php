<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone_number',
        'subject_specialization',
        'employee_id',
        'date_of_joining',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}