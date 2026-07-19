<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Customer;
use App\Models\Product;
use App\Services\SalesService;
use App\Exceptions\InsufficientStockException;

class SalesServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_processes_sale_and_deducts_stock()
    {
        $customer = Customer::factory()->create();
        $this->branch = \App\Models\Branch::factory()->create();
        $this->product = Product::factory()->create([
            'price' => 100,
        ]);
        $this->product->branches()->attach($this->branch->id, ['stock_quantity' => 50]);

        $service = new SalesService();
        $sale = $service->processSale([
            'branch_id' => $this->branch->id,
            'customer_id' => $customer->id,
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 2
                ]
            ]
        ]);

        $this->assertEquals(200.00, $sale->total_amount);
        $this->assertDatabaseHas('sale_items', [
            'sale_id' => $sale->id,
            'product_id' => $this->product->id,
            'quantity' => 2,
            'subtotal' => 200.00
        ]);
        
        $this->product->refresh();
        $pivot = \Illuminate\Support\Facades\DB::table('branch_product')
            ->where('branch_id', $this->branch->id)
            ->where('product_id', $this->product->id)
            ->first();
        $this->assertEquals(48, $pivot->stock_quantity);
    }

    public function test_it_throws_exception_on_insufficient_stock()
    {
        $branch = \App\Models\Branch::factory()->create();
        $customer = Customer::factory()->create();
        $product = Product::factory()->create([
            'price' => 100.00
        ]);
        $product->branches()->attach($branch->id, ['stock_quantity' => 5]);

        $service = new SalesService();
        
        $this->expectException(InsufficientStockException::class);

        $service->processSale([
            'branch_id' => $branch->id,
            'customer_id' => $customer->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 6 // More than available
                ]
            ]
        ]);
    }
}
