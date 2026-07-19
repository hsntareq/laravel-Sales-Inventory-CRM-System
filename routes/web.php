<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'products' => \App\Models\Product::with('branches')->get(),
        'employees' => \App\Models\Employee::all(),
        'customers' => \App\Models\Customer::with(['assignedEmployee', 'sales.items.product'])->get(),
        'sales' => \App\Models\Sale::with(['customer', 'items.product', 'branch'])->latest()->take(50)->get(),
        'branches' => \App\Models\Branch::all(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('/sales', [\App\Http\Controllers\SaleController::class, 'store'])->middleware(['auth', 'verified'])->name('sales.store');
Route::get('/sales/{sale}/invoice', [\App\Http\Controllers\SaleController::class, 'invoice'])->middleware(['auth', 'verified'])->name('sales.invoice');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store'])->name('customers.store');
    Route::put('/customers/{customer}', [\App\Http\Controllers\CustomerController::class, 'update'])->name('customers.update');
    Route::post('/customers/{customer}/assign', [\App\Http\Controllers\CustomerController::class, 'assign'])->name('customers.assign');
    Route::post('/customers/{customer}/email', [\App\Http\Controllers\CustomerController::class, 'email'])->name('customers.email');
});

Route::middleware('auth')->group(function () {
    Route::get('/billing', function () { return Inertia::render('Placeholder', ['title' => 'Billing']); })->name('billing');
    Route::get('/settings', function () { return Inertia::render('Placeholder', ['title' => 'Settings']); })->name('settings');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
