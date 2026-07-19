<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Customer;
use App\Models\Employee;

class ReengagementMail extends Mailable
{
    use Queueable, SerializesModels;

    public $customer;
    public $employee;

    public function __construct(Customer $customer, Employee $employee)
    {
        $this->customer = $customer;
        $this->employee = $employee;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We miss you at SinodTech! Here is a special offer.',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "<h1>Hi {$this->customer->first_name},</h1><p>We haven't seen you in a while! Your dedicated account manager, {$this->employee->first_name}, is here to help you find what you need.</p>"
        );
    }
}
