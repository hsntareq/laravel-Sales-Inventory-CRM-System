<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Product;
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $branches = \App\Models\Branch::all();
        $products = Product::factory(20)->create();

        foreach ($products as $product) {
            foreach ($branches as $branch) {
                if (rand(0, 1)) { // 50% chance to have stock at this branch
                    $product->branches()->attach($branch->id, ['stock_quantity' => rand(10, 100)]);
                }
            }
        }
    }
}
