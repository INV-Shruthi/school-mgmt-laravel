<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $perPage = $request->input('per_page', 5); 

        return Teacher::with('user')->paginate($perPage);
    }
    public function show($id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }

        return $teacher;
    }

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

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        if (!$this->isAdminOrOwner($teacher)) {
            abort(403, 'Unauthorized');
        }

        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted successfully']);
    }

    // ✅ Admin only
    private function authorizeAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only admin can perform this action.');
        }
    }

    // ✅ Admin or that specific teacher
    private function isAdminOrOwner(Teacher $teacher)
    {
        $user = auth()->user();
        return $user->role === 'admin' || $user->id === $teacher->user_id;
    }
}
