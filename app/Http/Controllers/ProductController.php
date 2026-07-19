<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku|max:100',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'price' => $validated['price'],
        ]);

        if ($validated['stock_quantity'] > 0) {
            $product->branches()->attach($validated['branch_id'], ['stock_quantity' => $validated['stock_quantity']]);
        }

        return redirect()->back()->with('success', 'Product created successfully.');
    }
}
