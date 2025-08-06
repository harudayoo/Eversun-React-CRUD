<?php

namespace App\Providers;

use App\Events\TransactionStatusChanged;
use App\Listeners\SendTransactionStatusNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        TransactionStatusChanged::class => [
            SendTransactionStatusNotification::class,
        ],
        \App\Events\LoanStatusChanged::class => [
            \App\Listeners\SendLoanStatusNotification::class,
        ],
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
