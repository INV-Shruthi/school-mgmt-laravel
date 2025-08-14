<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;
    protected $teacherUser;
    protected $studentUser;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin
        $this->admin = User::factory()->create(['role' => 'admin']);

        // Create teacher with user
        $this->teacherUser = User::factory()->create(['role' => 'teacher']);
        $this->teacher = Teacher::factory()->create(['user_id' => $this->teacherUser->id]);

        // Create student with user assigned to the teacher
        $this->studentUser = User::factory()->create(['role' => 'student']);
        $this->student = Student::factory()->create([
            'user_id' => $this->studentUser->id,
            'assigned_teacher_id' => $this->teacher->id,
        ]);
    }

    /** @test */
    public function admin_can_list_all_students()
    {
        Student::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/students');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    /** @test */
    public function teacher_can_list_only_assigned_students()
    {
        // Create a student assigned to another teacher
        $otherTeacherUser = User::factory()->create(['role' => 'teacher']);
        $otherTeacher = Teacher::factory()->create(['user_id' => $otherTeacherUser->id]);
        Student::factory()->create(['assigned_teacher_id' => $otherTeacher->id]);

        $response = $this->actingAs($this->teacherUser, 'api')
            ->getJson('/api/students');

        $response->assertStatus(200);
        $data = $response->json('data');

        // Ensure all returned students belong to the teacher
        foreach ($data as $student) {
            $this->assertEquals($this->teacher->id, $student['assigned_teacher_id']);
        }
    }

    /** @test */
    public function admin_can_update_student()
    {
        $updateData = ['class' => '10-B'];

        $response = $this->actingAs($this->admin, 'api')
            ->putJson("/api/students/{$this->student->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Student updated successfully']);

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'class' => '10-B'
        ]);
    }

    /** @test */
    public function teacher_can_update_only_assigned_students()
    {
        $updateData = ['class' => '9-A'];

        $response = $this->actingAs($this->teacherUser, 'api')
            ->putJson("/api/students/{$this->student->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Student updated successfully']);

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'class' => '9-A'
        ]);
    }

    /** @test */
    public function admin_can_delete_student()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->deleteJson("/api/students/{$this->student->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Student deleted successfully']);

        $this->assertDatabaseMissing('students', [
            'id' => $this->student->id
        ]);
    }

    /** @test */
    public function teacher_can_delete_only_assigned_students()
    {
        $response = $this->actingAs($this->teacherUser, 'api')
            ->deleteJson("/api/students/{$this->student->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Student deleted successfully']);

        $this->assertDatabaseMissing('students', [
            'id' => $this->student->id
        ]);
    }
}
