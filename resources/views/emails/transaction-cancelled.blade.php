<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Cancelled</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            color: #2563eb;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .title {
            color: #dc2626;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #4b5563;
        }
        .value {
            color: #111827;
        }
        .cancelled-badge {
            background-color: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚 Eversun Library</div>
            <h1 class="title">Transaction Cancelled</h1>
            <p>Your book lending transaction has been cancelled.</p>
        </div>

        <div class="notice">
            <strong>Important:</strong> This transaction has been cancelled. If you believe this was done in error, please contact the library staff immediately.
        </div>

        <div class="details">
            <div class="detail-row">
                <span class="label">Student Name:</span>
                <span class="value">{{ $transaction->student->first_name }} {{ $transaction->student->last_name }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Transaction ID:</span>
                <span class="value">#{{ $transaction->id }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Transaction Type:</span>
                <span class="value">{{ ucfirst($transaction->transaction_type) }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Original Date:</span>
                <span class="value">{{ $transaction->transaction_date->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value"><span class="cancelled-badge">{{ ucfirst($transaction->status) }}</span></span>
            </div>
            <div class="detail-row">
                <span class="label">Cancelled by:</span>
                <span class="value">{{ $transaction->attendant->first_name }} {{ $transaction->attendant->last_name }}</span>
            </div>
        </div>

        @if($transaction->loans->count() > 0)
        <div class="details">
            <h3 style="margin-top: 0; color: #374151;">Books that were in this Transaction:</h3>
            @foreach($transaction->loans as $loan)
            <div class="detail-row">
                <span class="label">{{ $loan->book->book_title }}</span>
                <span class="value">by {{ $loan->book->author }}</span>
            </div>
            @endforeach
        </div>
        @endif

        <div class="footer">
            <p>If you have any questions about this cancellation, please contact the library staff.</p>
            <p>We apologize for any inconvenience this may have caused.</p>
            <p style="margin-top: 20px;">
                <small>This is an automated message. Please do not reply to this email.</small>
            </p>
        </div>
    </div>
</body>
</html>
