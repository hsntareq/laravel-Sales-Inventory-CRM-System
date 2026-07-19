<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'sku' => $this->sku,
            'product_name' => $this->name,
            'price' => (float) $this->price,
            'available_stock' => $this->stock_quantity,
        ];
    }
}
