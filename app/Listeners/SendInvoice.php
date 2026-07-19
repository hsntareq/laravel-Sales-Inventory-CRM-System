<?php

namespace App\Listeners;

use App\Events\SaleCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvoiceMail;

class SendInvoice implements ShouldQueue
{
    public function handle(SaleCompleted $event): void
    {
        if ($event->sale->customer->email) {
            Mail::to($event->sale->customer->email)->send(new InvoiceMail($event->sale));
        }
    }
}
