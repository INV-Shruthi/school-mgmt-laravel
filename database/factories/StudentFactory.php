<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Teacher; 

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // will create a linked user
            'roll_number' => $this->faker->unique()->numerify('R###'),
            'class' => $this->faker->word,
            'phone_number' => $this->faker->phoneNumber,
            'date_of_birth' => $this->faker->date(),
            'admission_date' => $this->faker->date('Y-m-d'),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'assigned_teacher_id' => Teacher::factory(), // ensures a teacher exists




        ];
    }
}
