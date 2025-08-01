<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return Student::with('user')->get();
        }

        if ($user->role === 'teacher') {
            return Student::with('user')
                ->where('assigned_teacher_id', $user->teacher->id)
                ->get();
        }

        abort(403, 'Unauthorized');
    }

    public function show($id)
    {
        $student = Student::with('user')->findOrFail($id);
        $user = auth()->user();

        if ($user->role === 'admin') {
            return $student;
        }

        if ($user->role === 'teacher' && $student->assigned_teacher_id === $user->teacher->id) {
            return $student;
        }

        if ($user->role === 'student' && $student->user_id === $user->id) {
            return $student;
        }

        abort(403, 'Unauthorized');
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $user = auth()->user();

        if ($user->role !== 'teacher' || $student->assigned_teacher_id !== $user->teacher->id) {
            abort(403, 'Unauthorized');
        }

        $student->update($request->only([
            'phone_number',
            'roll_number',
            'class',
            'date_of_birth',
            'admission_date',
            'status'
        ]));

        return response()->json(['message' => 'Student updated successfully']);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $user = auth()->user();

        if ($user->role !== 'teacher' || $student->assigned_teacher_id !== $user->teacher->id) {
            abort(403, 'Unauthorized');
        }

        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}

