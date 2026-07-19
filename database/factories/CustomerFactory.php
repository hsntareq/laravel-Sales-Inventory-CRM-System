<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;
class CustomerFactory extends Factory
{
    public function definition(): array
    {
        $isLost = fake()->boolean(30);
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'last_purchase_date' => $isLost ? fake()->dateTimeBetween('-1 year', '-91 days') : fake()->dateTimeBetween('-90 days', 'now'),
            'assigned_employee_id' => null,
        ];
    }
}
