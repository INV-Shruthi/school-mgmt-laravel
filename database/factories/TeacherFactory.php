<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'phone_number' => fake()->phoneNumber(),
            'subject_specialization' => fake()->word(),
            'employee_id' => fake()->unique()->numerify('EMP###'),
            'date_of_joining' => fake()->date(),
            'status' => 'active',
        ];
    }
}
