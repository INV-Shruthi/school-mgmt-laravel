<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TeacherControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacherData;

    protected function setUp(): void
    {
        parent::setUp();

        // Create an admin user to perform actions
        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);

        // Teacher sample data
        $this->teacherData = [
            'username' => 'teacher123',
            'email' => 'teacher@example.com',
            'password' => 'password',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone_number' => '1234567890',
            'subject_specialization' => 'Mathematics',
            'employee_id' => 'EMP001',
            'date_of_joining' => '2025-01-01',
            'status' => 'active',
        ];
    }

/** @test */
public function admin_can_get_all_teachers()
{
    // Create teachers with linked users
    Teacher::factory()->count(3)->create();

    $response = $this->actingAs($this->admin, 'api') // specify api guard
        ->getJson('/api/teachers');

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data' => [
                     '*' => [
                         'id',
                         'user' => [
                             'id',
                             'first_name',
                             'last_name',
                             'email',
                             'role'
                         ],
                         'phone_number',
                         'subject_specialization',
                         'employee_id',
                         'date_of_joining',
                         'status'
                     ]
                 ]
             ]);
}

/** @test */
public function admin_can_update_teacher()
{
    $teacher = Teacher::factory()->create();

    $updateData = [
        'first_name' => 'UpdatedName', // user field
        'phone_number' => '9876543210' // teacher field
    ];

    $response = $this->actingAs($this->admin, 'api')
        ->putJson("/api/teachers/{$teacher->id}", $updateData);

    $response->assertStatus(200)
             ->assertJsonFragment(['first_name' => 'UpdatedName']);

    // Check both tables were updated
    $this->assertDatabaseHas('users', [
        'id' => $teacher->user_id,
        'first_name' => 'UpdatedName'
    ]);

    $this->assertDatabaseHas('teachers', [
        'id' => $teacher->id,
        'phone_number' => '9876543210'
    ]);
}

/** @test */
public function admin_can_delete_teacher()
{
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($this->admin, 'api')
        ->deleteJson("/api/teachers/{$teacher->id}");

    $response->assertStatus(200)
             ->assertJsonFragment(['message' => 'Teacher deleted successfully']);

    $this->assertDatabaseMissing('teachers', [
        'id' => $teacher->id,
    ]);

    // Optionally check user also deleted if cascade
    $this->assertDatabaseMissing('users', [
        'id' => $teacher->user_id
    ]);
}
}