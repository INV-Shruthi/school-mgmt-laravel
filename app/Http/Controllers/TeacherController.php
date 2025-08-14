<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    //  LIST ALL TEACHERS (admin only)
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $perPage = $request->input('per_page', 5);

        return Teacher::with('user')
                     ->orderBy('created_at', 'desc')
                     ->paginate($perPage);
    }

    //  SHOW A TEACHER PROFILE (admin, own profile, or student's assigned teacher)
    public function show($id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        $user = auth()->user();

        // Admin can view any teacher
        if ($user->role === 'admin') {
            return $teacher;
        }

        // Teacher can view their own profile
        if ($user->role === 'teacher' && $teacher->user_id === $user->id) {
            return $teacher;
        }

        // Student can view their assigned teacher only
        if ($user->role === 'student') {
            $student = $user->student;
            if ($student && $student->assigned_teacher_id === $teacher->id) {
                return $teacher;
            }
        }

        abort(403, 'Unauthorized');
    }

    // UPDATE A TEACHER (admin or that teacher)
    public function update(Request $request, $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $teacher->user_id,
            'phone_number' => 'sometimes|string',
            'subject_specialization' => 'sometimes|string',
            'employee_id' => 'sometimes|string|unique:teachers,employee_id,' . $teacher->id,
            'date_of_joining' => 'sometimes|date',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        // Update user fields if present
        if (!empty($validated['first_name']) || !empty($validated['last_name']) || !empty($validated['email'])) {
            $teacher->user->update(array_filter([
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'email' => $validated['email'] ?? null,
            ]));
        }

        // Update teacher fields if present
        $teacher->update(array_filter([
            'phone_number' => $validated['phone_number'] ?? null,
            'subject_specialization' => $validated['subject_specialization'] ?? null,
            'employee_id' => $validated['employee_id'] ?? null,
            'date_of_joining' => $validated['date_of_joining'] ?? null,
            'status' => $validated['status'] ?? null,
        ]));

        return response()->json($teacher->fresh()->load('user'), 200);
    }

    // DELETE A TEACHER (admin or that teacher)
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }
        $teacher->user()->delete();

        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted successfully']);
    }

    //  Admin only
    private function authorizeAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only admin can perform this action.');
        }
    }

    //  Admin or that specific teacher
    private function isAdminOrOwner(Teacher $teacher)
    {
        $user = auth()->user();
        return $user->role === 'admin' || $user->id === $teacher->user_id;
    }
}
