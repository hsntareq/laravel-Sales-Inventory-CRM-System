<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Events\SaleCompleted;

class SalesService
{
    /**
     * Process a new sale transaction.
     * 
     * @param array $data Validated data containing customer_id and items array.
     * @return Sale
     * @throws InsufficientStockException|Exception
     */
    public function processSale(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            $sale = Sale::create([
                'branch_id' => $data['branch_id'],
                'customer_id' => $data['customer_id'],
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    throw new Exception("Product not found.");
                }

                // Lock the specific branch_product pivot row
                $pivot = DB::table('branch_product')
                    ->where('branch_id', $data['branch_id'])
                    ->where('product_id', $product->id)
                    ->lockForUpdate()
                    ->first();

                if (!$pivot) {
                    throw new Exception("Product not available at this branch.");
                }

                if ($pivot->stock_quantity < $item['quantity']) {
                    throw new InsufficientStockException(
                        "Insufficient stock for product [{$product->sku}] {$product->name} at this branch. Requested: {$item['quantity']}, Available: {$pivot->stock_quantity}."
                    );
                }

                $subtotal = $product->price * $item['quantity'];

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                // Deduct inventory from the pivot
                DB::table('branch_product')
                    ->where('id', $pivot->id)
                    ->decrement('stock_quantity', $item['quantity']);

                $totalAmount += $subtotal;
            }

            // Update parent sale total
            $sale->update(['total_amount' => $totalAmount]);

            event(new SaleCompleted($sale));
            
            return $sale->load('items.product');
        });
    }
}
