<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_register_a_teacher()
    {
        // Create admin
        $admin = User::factory()->create([
            'role' => 'admin',
            'password' => Hash::make('password123')
        ]);

        // Make API request as admin
        $response = $this->actingAs($admin, 'api')->postJson('/api/register', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'teacher@example.com',
            'password' => 'password123',
            'role' => 'teacher',
            'phone_number' => '9876543210',
            'subject_specialization' => 'Math',
            'employee_id' => 'EMP001',
            'date_of_joining' => '2025-08-01',
            'status' => 'active',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'User registered successfully']);

        $this->assertDatabaseHas('users', ['email' => 'teacher@example.com']);
        $this->assertDatabaseHas('teachers', ['employee_id' => 'EMP001']);
    }

    /** @test */
    public function non_admin_cannot_register_users()
    {
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'password' => Hash::make('password123')
        ]);

        $response = $this->actingAs($teacher, 'api')->postJson('/api/register', [
            'first_name' => 'Mark',
            'last_name' => 'Smith',
            'email' => 'student@example.com',
            'password' => 'password123',
            'role' => 'student',
        ]);

        $response->assertStatus(403)
                 ->assertJson(['error' => 'Only admin can register new users']);
    }

    /** @test */
    public function login_with_valid_credentials_returns_token()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }

    /** @test */
    public function login_with_invalid_credentials_fails()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['error' => 'Invalid credentials']);
    }
}
