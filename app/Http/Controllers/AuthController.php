<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // ✅ Allow only admin to register users
        if (auth()->check() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Only admin can register users'], 403);
        }

        // ✅ Validate base user data
        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:6',
            'role'       => 'required|in:teacher,student',
        ]);

        // ✅ Create the user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
        ]);

        // ✅ Handle role-specific details
        if ($request->role === 'teacher') {
            $request->validate([
                'phone_number'     => 'required',
                'employee_id'      => 'required|unique:teachers',
                'subject'          => 'required',
                'date_of_joining'  => 'required|date',
                'status'           => 'required|in:active,inactive',
            ]);

            Teacher::create([
                'user_id'         => $user->id,
                'phone_number'    => $request->phone_number,
                'employee_id'     => $request->employee_id,
                'subject'         => $request->subject,
                'date_of_joining' => $request->date_of_joining,
                'status'          => $request->status,
            ]);
        }

        if ($request->role === 'student') {
            $request->validate([
                'roll_number'     => 'required|unique:students',
                'class'           => 'required',
                'section'         => 'required',
                'admission_date'  => 'required|date',
            ]);

            Student::create([
                'user_id'        => $user->id,
                'roll_number'    => $request->roll_number,
                'class'          => $request->class,
                'section'        => $request->section,
                'admission_date' => $request->admission_date,
            ]);
        }

        return response()->json(['message' => 'User registered successfully with role details'], 201);
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
        return response()->json(auth()->user());
    }
}
