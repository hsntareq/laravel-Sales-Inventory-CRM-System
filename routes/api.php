<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [\App\Http\Controllers\Api\DashboardDataController::class, 'products']);
Route::get('/sales', [\App\Http\Controllers\Api\DashboardDataController::class, 'sales']);
Route::get('/customers', [\App\Http\Controllers\Api\DashboardDataController::class, 'customers']);
