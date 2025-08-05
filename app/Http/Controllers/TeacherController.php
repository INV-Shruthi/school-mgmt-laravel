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

    //  UPDATE A TEACHER (admin or that teacher)
    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }

        $teacher->update($request->only([
            'phone_number',
            'subject_specialization',
            'employee_id',
            'date_of_joining',
            'status',
        ]));

        return response()->json(['message' => 'Teacher updated successfully']);
    }

    // DELETE A TEACHER (admin or that teacher)
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }

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
