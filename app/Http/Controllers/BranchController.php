<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function toggleStatus(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $branch->update(['is_active' => $validated['is_active']]);

        return redirect()->back()->with('success', 'Branch status updated successfully.');
    }
}
