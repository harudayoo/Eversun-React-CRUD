<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Return Confirmed</title>
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
            color: #059669;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .book-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .book-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .book-author {
            font-size: 16px;
            opacity: 0.9;
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
        .success-badge {
            background-color: #059669;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .payment-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .thank-you {
            background-color: #ecfdf5;
            border: 1px solid #10b981;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #065f46;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚 Eversun Library</div>
            <h1 class="title">Book Return Confirmed!</h1>
            <p>Thank you for returning your book on time.</p>
        </div>

        <div class="book-info">
            <div class="book-title">{{ $loan->book->book_title }}</div>
            <div class="book-author">by {{ $loan->book->author }}</div>
        </div>

        <div class="details">
            <div class="detail-row">
                <span class="label">Student Name:</span>
                <span class="value">{{ $loan->transaction->student->first_name }} {{ $loan->transaction->student->last_name }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Loan ID:</span>
                <span class="value">#{{ $loan->id }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Loan Date:</span>
                <span class="value">{{ $loan->loan_date->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Due Date:</span>
                <span class="value">{{ $loan->due_date->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Return Date:</span>
                <span class="value">{{ $loan->return_date->format('F j, Y g:i A') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value"><span class="success-badge">Returned</span></span>
            </div>
            <div class="detail-row">
                <span class="label">Processed by:</span>
                <span class="value">Library Staff</span>
            </div>
        </div>

        @if($loan->payment_amount > 0)
        <div class="payment-info">
            <strong>Payment Information:</strong><br>
            A payment of <strong>${{ number_format($loan->payment_amount, 2) }}</strong> was processed for this return.
            @if($loan->return_date > $loan->due_date)
                This may include late fees for overdue return.
            @endif
        </div>
        @endif

        @if($loan->return_date <= $loan->due_date)
        <div class="thank-you">
            <strong>🎉 Excellent!</strong><br>
            You returned this book on time. Thank you for being a responsible borrower!
        </div>
        @else
        <div class="payment-info">
            <strong>Notice:</strong><br>
            This book was returned {{ $loan->return_date->diffInDays($loan->due_date) }} day(s) after the due date.
            Please try to return books on time to avoid any late fees.
        </div>
        @endif

        <div class="footer">
            <p>Thank you for using Eversun Library System!</p>
            <p>We hope you enjoyed reading "<strong>{{ $loan->book->book_title }}</strong>"</p>
            <p>Feel free to browse our collection for your next great read!</p>
            <p style="margin-top: 20px;">
                <small>This is an automated message. Please do not reply to this email.</small>
            </p>
        </div>
    </div>
</body>
</html>
