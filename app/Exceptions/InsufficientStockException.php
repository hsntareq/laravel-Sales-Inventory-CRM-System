<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class InsufficientStockException extends Exception
{
    public function __construct(string $message = "Insufficient stock available.")
    {
        parent::__construct($message);
    }

    public function render($request): JsonResponse
    {
        return response()->json([
            'error' => 'Insufficient Stock',
            'message' => $this->getMessage(),
        ], 422);
    }
}
