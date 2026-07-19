<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'assigned_employee_id' => 'nullable|exists:employees,id',
        ]);

        Customer::create($validated);

        return redirect()->back()->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update($validated);

        return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    public function assign(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'assigned_employee_id' => 'required|exists:employees,id',
        ]);

        $customer->update(['assigned_employee_id' => $validated['assigned_employee_id']]);

        return redirect()->back()->with('success', 'Employee assigned successfully.');
    }

    public function email(Request $request, Customer $customer)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Simulate email sending
        // Mail::raw($request->message, function ($message) use ($customer, $request) {
        //     $message->to($customer->email)
        //             ->subject($request->subject);
        // });

        return redirect()->back()->with('success', 'Email sent successfully to ' . $customer->email);
    }
}
