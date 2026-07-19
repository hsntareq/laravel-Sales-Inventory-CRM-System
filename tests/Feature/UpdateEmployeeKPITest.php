<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Sale;
use App\Events\SaleCompleted;
use App\Listeners\UpdateEmployeeKPI;
use Carbon\Carbon;

class UpdateEmployeeKPITest extends TestCase
{
    use RefreshDatabase;

    public function test_kpi_increases_when_lost_customer_makes_a_purchase()
    {
        $employee = Employee::factory()->create(['kpi_score' => 50]);
        $customer = Customer::factory()->create([
            'assigned_employee_id' => $employee->id,
            'last_purchase_date' => Carbon::now()->subDays(100)
        ]);
        $branch = \App\Models\Branch::factory()->create();
        // Customer makes a purchase
        $sale = Sale::create([
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'total_amount' => 0,
        ]);$listener = new UpdateEmployeeKPI();
        $listener->handle(new SaleCompleted($sale));

        $employee->refresh();
        $customer->refresh();

        $this->assertEquals(60, $employee->kpi_score); // Increased by 10
        $this->assertNull($customer->assigned_employee_id); // Re-engaged
        $this->assertTrue($customer->last_purchase_date->isToday());
    }
}
