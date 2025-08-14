<?php

namespace Tests\Unit;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_correct_fillable_fields()
    {
        $teacher = new Teacher();

        $this->assertEquals([
            'user_id',
            'phone_number',
            'subject_specialization',
            'employee_id',
            'date_of_joining',
            'status',
        ], $teacher->getFillable());
    }

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $teacher = Teacher::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $teacher->user);
        $this->assertEquals($user->id, $teacher->user->id);
    }
}
