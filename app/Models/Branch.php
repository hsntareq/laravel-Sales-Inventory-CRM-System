<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    /** @use HasFactory<\Database\Factories\BranchFactory> */
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = ['name', 'address', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('stock_quantity')->withTimestamps();
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
