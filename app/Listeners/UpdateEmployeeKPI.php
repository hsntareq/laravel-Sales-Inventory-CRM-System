<?php

namespace App\Listeners;

use App\Events\SaleCompleted;
use Illuminate\Queue\InteractsWithQueue;
use Carbon\Carbon;

class UpdateEmployeeKPI
{
    public function handle(SaleCompleted $event): void
    {
        $customer = $event->sale->customer;
        
        if ($customer->assigned_employee_id) {
            $employee = $customer->assignedEmployee;
            $employee->increment('kpi_score', 10);
            
            $customer->update([
                'assigned_employee_id' => null,
                'last_purchase_date' => Carbon::now(),
            ]);
        } else {
            $customer->update([
                'last_purchase_date' => Carbon::now(),
            ]);
        }
    }
}
