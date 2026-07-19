<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $products = Product::all();
        $branches = \App\Models\Branch::all();
        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }
        foreach ($customers as $customer) {
            if (fake()->boolean()) {
                $numSales = fake()->numberBetween(1, 3);
                for ($i = 0; $i < $numSales; $i++) {
                    $sale = Sale::create([
                        'branch_id' => $branches->random()->id,
                        'customer_id' => $customer->id,
                        'total_amount' => 0,
                    ]);
                    $totalAmount = 0;
                    $numItems = fake()->numberBetween(1, 4);
                    for ($j = 0; $j < $numItems; $j++) {
                        $product = $products->random();
                        $quantity = fake()->numberBetween(1, 5);
                        $subtotal = $product->price * $quantity;
                        SaleItem::create([
                            'sale_id' => $sale->id,
                            'product_id' => $product->id,
                            'quantity' => $quantity,
                            'unit_price' => $product->price,
                            'subtotal' => $subtotal,
                        ]);
                        $totalAmount += $subtotal;
                    }
                    $sale->update(['total_amount' => $totalAmount]);
                }
            }
        }
    }
}
