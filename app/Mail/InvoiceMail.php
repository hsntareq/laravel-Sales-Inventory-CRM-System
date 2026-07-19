<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Sale;

use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $sale;

    public function __construct(Sale $sale)
    {
        $this->sale = $sale;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Invoice from SinodTech',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "<h1>Thank you for your purchase!</h1><p>Your total is: $" . number_format($this->sale->total_amount, 2) . "</p><p>Please find your invoice attached.</p>"
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.invoice', ['sale' => $this->sale]);
        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(fn () => $pdf->output(), "invoice_{$this->sale->id}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
