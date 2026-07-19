<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $sale->id }}</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <h2>Invoice #{{ $sale->id }}</h2>
    <p><strong>Date:</strong> {{ $sale->created_at->format('M d, Y') }}</p>
    <p><strong>Customer:</strong> {{ $sale->customer->first_name }} {{ $sale->customer->last_name }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sale->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>${{ number_format($item->product->price, 2) }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="text-right"><strong>Total</strong></td>
                <td><strong>${{ number_format($sale->total_amount, 2) }}</strong></td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
