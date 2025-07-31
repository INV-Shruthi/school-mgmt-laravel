<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;

/*
| Public Routes
*/
Route::post('/login', [AuthController::class, 'login']);

/*
| Protected Routes 
*/
Route::middleware('auth:api')->group(function () {

    // Authenticated user routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Only Admin
    Route::post('/register', [AuthController::class, 'register']);

    // Teacher routes 
    Route::get('/teachers', [TeacherController::class, 'index']);          // Admin only
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);      // Admin or that teacher
    Route::put('/teachers/{id}', [TeacherController::class, 'update']);    // Admin or that teacher
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']); // Admin or that teacher

    // Student routes
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{id}', [StudentController::class, 'show']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);

});
