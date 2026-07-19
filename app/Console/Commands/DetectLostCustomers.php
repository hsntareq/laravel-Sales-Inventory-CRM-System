<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReengagementMail;

class DetectLostCustomers extends Command
{
    protected $signature = 'crm:detect-lost-customers';
    protected $description = 'Finds customers with no purchases in the last 90 days and assigns them to an employee';

    public function handle()
    {
        $this->info('Detecting lost customers...');
        
        $ninetyDaysAgo = Carbon::now()->subDays(90);
        
        // Find customers who haven't purchased in 90 days and aren't assigned yet
        $lostCustomers = Customer::where(function ($query) use ($ninetyDaysAgo) {
                $query->where('last_purchase_date', '<=', $ninetyDaysAgo)
                      ->orWhereNull('last_purchase_date');
            })
            ->whereNull('assigned_employee_id')
            ->get();
            
        if ($lostCustomers->isEmpty()) {
            $this->info('No new lost customers found.');
            return;
        }

        $employees = Employee::all();
        
        if ($employees->isEmpty()) {
            $this->error('No employees available to assign.');
            return;
        }

        $count = 0;
        foreach ($lostCustomers as $customer) {
            $employee = $employees->random();
            $customer->update(['assigned_employee_id' => $employee->id]);
            
            // Simulate sending a re-engagement email
            try {
                Mail::to($customer->email)->send(new ReengagementMail($customer, $employee));
            } catch (\Exception $e) {
                // Mailtrap free tier rate limit is ~2 emails/sec. Throttle if we hit it.
                sleep(2);
                Mail::to($customer->email)->send(new ReengagementMail($customer, $employee));
            }
            
            // Throttle to avoid hitting Mailtrap limits
            usleep(600000);
            $count++;
        }

        $this->info("Successfully assigned {$count} lost customers to employees.");
    }
}
