<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone_number',
        'roll_number',
        'class',
        'date_of_birth',
        'admission_date',
        'status',
        'assigned_teacher_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTeacher()
    {
        return $this->belongsTo(Teacher::class, 'assigned_teacher_id');
    }
}


