<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $sale->id }}</title>
    <style>
        body { font-family: sans-serif; color: #333; line-height: 1.6; }
        .invoice-container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #4f46e5; margin-bottom: 5px; }
        .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
        .details div { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border-bottom: 1px solid #ddd; padding: 12px 8px; text-align: left; }
        th { background-color: #f9fafb; font-weight: bold; color: #555; text-transform: uppercase; font-size: 12px; }
        .text-right { text-align: right; }
        .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>Thank you for your purchase!</h1>
            <p>Here is your digital invoice for Sale #{{ $sale->id }}</p>
        </div>
        
        <div class="details">
            <div style="float:left; width:50%;">
                <p><strong>Billed To:</strong><br>
                {{ $sale->customer->first_name }} {{ $sale->customer->last_name }}<br>
                {{ $sale->customer->email }}</p>
            </div>
            <div style="float:right; width:50%; text-align:right;">
                <p><strong>Date:</strong> {{ $sale->created_at->format('M d, Y') }}<br>
                <strong>Branch:</strong> {{ $sale->branch ? $sale->branch->name : 'N/A' }}</p>
            </div>
            <div style="clear:both;"></div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sale->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td class="text-right">${{ number_format($item->product->price, 2) }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="3" class="text-right">Total</td>
                    <td class="text-right">${{ number_format($sale->total_amount, 2) }}</td>
                </tr>
            </tfoot>
        </table>
        
        <p style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            A PDF copy of this invoice has also been attached to this email.
        </p>
    </div>
</body>
</html>
