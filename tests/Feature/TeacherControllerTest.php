<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacherUser;
    protected $studentUser;
    protected $teacher;

    protected function setUp(): void
    {
        parent::setUp();

        // Create an admin
        $this->admin = User::factory()->create(['role' => 'admin']);

        // Create a teacher
        $this->teacherUser = User::factory()->create(['role' => 'teacher']);
        $this->teacher = Teacher::factory()->create([
            'user_id' => $this->teacherUser->id,
        ]);

        // Create a student
        $this->studentUser = User::factory()->create(['role' => 'student']);
    }

    /** @test */
    public function admin_can_list_teachers()
    {
        $response = $this->actingAs($this->admin)->get('/api/teachers');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    /** @test */
    public function non_admin_cannot_list_teachers()
    {
        $response = $this->actingAs($this->teacherUser)->get('/api/teachers');

        $response->assertStatus(403);
    }

    /** @test */
    public function teacher_can_view_own_profile()
    {
        $response = $this->actingAs($this->teacherUser)
                         ->get('/api/teachers/' . $this->teacher->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['user_id' => $this->teacherUser->id]);
    }

    /** @test */
    public function admin_can_update_teacher()
    {
        $payload = ['phone_number' => '9999999999'];

        $response = $this->actingAs($this->admin)
                         ->put('/api/teachers/' . $this->teacher->id, $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Teacher updated successfully']);
    }

    /** @test */
    public function teacher_can_delete_own_profile()
    {
        $response = $this->actingAs($this->teacherUser)
                         ->delete('/api/teachers/' . $this->teacher->id);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Teacher deleted successfully']);
    }
}
