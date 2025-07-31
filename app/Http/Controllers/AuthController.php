<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Only allow admin to register
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Only admin can register new users'], 403);
        }

        // Basic user validation
        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:6',
            'role'       => 'required|in:admin,teacher,student',
        ]);

        // Create base user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
        ]);

        // Teacher specific details
        if ($request->role === 'teacher') {
            $request->validate([
                'phone_number'           => 'required|digits:10',
                'subject_specialization' => 'required|string',
                'employee_id'            => 'required|unique:teachers',
                'date_of_joining'        => 'required|date',
                'status'                 => 'required|in:active,inactive',
            ]);

            Teacher::create([
                'user_id'               => $user->id,
                'phone_number'          => $request->phone_number,
                'subject_specialization'=> $request->subject_specialization,
                'employee_id'           => $request->employee_id,
                'date_of_joining'       => $request->date_of_joining,
                'status'                => $request->status,
            ]);
        }

        // Student specific details
        if ($request->role === 'student') {
            $request->validate([
                'phone_number'   => 'required|digits:10',
                'roll_number'    => 'required|unique:students',
                'class'          => 'required|string',
                'date_of_birth'  => 'required|date',
                'admission_date' => 'required|date',
                'status'         => 'required|in:active,inactive',
                'assigned_teacher_id' => 'required|exists:teachers,id',
            ]);

            Student::create([
                'user_id'           => $user->id,
                'phone_number'      => $request->phone_number,
                'roll_number'       => $request->roll_number,
                'class'             => $request->class,
                'date_of_birth'     => $request->date_of_birth,
                'admission_date'    => $request->admission_date,
                'status'            => $request->status,
                'assigned_teacher_id' => $request->assigned_teacher_id,
            ]);
        }

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'user'  => auth()->user(),
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function me()
    {
        $user = auth()->user()->load('teacher', 'student');
        return response()->json($user);
    }
}
