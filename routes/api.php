<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:api'])->group(function () {

    // Only admin can register new users
    Route::post('/register', [AuthController::class, 'register'])->middleware('role:admin');

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
