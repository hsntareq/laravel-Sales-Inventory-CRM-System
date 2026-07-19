<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardDataController extends Controller
{
    public function products(Request $request)
    {
        $query = Product::with('branches');
        
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($branch = $request->query('branch')) {
            if ($branch !== 'all') {
                $query->whereHas('branches', function($q) use ($branch) {
                    $q->where('branches.id', $branch);
                });
            }
        }

        return response()->json($query->paginate(15));
    }

    public function sales(Request $request)
    {
        $query = Sale::with(['customer', 'items.product', 'branch'])->latest();
        
        if ($search = $request->query('search')) {
            $query->whereHas('customer', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($branch = $request->query('branch')) {
            if ($branch !== 'all') {
                $query->where('branch_id', $branch);
            }
        }

        return response()->json($query->paginate(15));
    }

    public function customers(Request $request)
    {
        $query = Customer::with(['assignedEmployee', 'sales.items.product']);
        
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $type = $request->query('type', 'active');
        $ninetyDaysAgo = Carbon::now()->subDays(90);

        if ($type === 'lost') {
            $query->where(function ($q) use ($ninetyDaysAgo) {
                $q->where('last_purchase_date', '<=', $ninetyDaysAgo)
                  ->orWhereNull('last_purchase_date');
            });
            
            if ($assignment = $request->query('assignment')) {
                if ($assignment === 'assigned') {
                    $query->whereNotNull('assigned_employee_id');
                } elseif ($assignment === 'unassigned') {
                    $query->whereNull('assigned_employee_id');
                }
            }
        } else {
            $query->where('last_purchase_date', '>', $ninetyDaysAgo);
        }

        return response()->json($query->paginate(15));
    }
}
