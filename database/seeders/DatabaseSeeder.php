<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sinodtech.com',
            'password' => bcrypt('password123'),
        ]);

        \App\Models\Branch::factory(5)->create();

        $this->call([
            ProductSeeder::class,
            EmployeeSeeder::class,
            CustomerSeeder::class,
            SaleSeeder::class,
        ]);
    }
}
