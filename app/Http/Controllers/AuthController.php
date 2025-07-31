<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Only allow if authenticated user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Only admin can register new users'], 403);
        }

        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:6',
            'role'       => 'required|in:admin,teacher,student',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
        ]);

        // If role is teacher, require and save teacher-specific data
        if ($request->role === 'teacher') {
            $request->validate([
                'phone_number'          => 'required',
                'subject_specialization'=> 'required',
                'employee_id'           => 'required|unique:teachers',
                'date_of_joining'       => 'required|date',
                'status'                => 'required|in:active,inactive',
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
        return response()->json(auth()->user()->load('teacher'));
    }
}
