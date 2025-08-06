<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Loan Confirmed</title>
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
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .book-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .book-title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .book-author {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .book-status {
            background-color: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
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
            margin-bottom: 12px;
            padding-bottom: 12px;
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
            font-weight: 500;
        }
        .important-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            color: #92400e;
        }
        .due-date-highlight {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #991b1b;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .reminder {
            background-color: #eff6ff;
            border: 1px solid #3b82f6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #1e40af;
        }
        .contact-info {
            background-color: #f0f9ff;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            border-left: 4px solid #0ea5e9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚 Eversun Library</div>
            <h1 class="title">Book Loan Confirmed!</h1>
            <p>Your book has been successfully borrowed from our library.</p>
        </div>

        <div class="book-info">
            <div class="book-title">{{ $loan->book->book_title }}</div>
            <div class="book-author">by {{ $loan->book->author }}</div>
            <div class="book-status">✅ Now Borrowed</div>
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
                <span class="value">{{ $loan->loan_date->format('F j, Y g:i A') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Due Date:</span>
                <span class="value">{{ $loan->due_date->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Loan Period:</span>
                <span class="value">{{ $loan->loan_date->diffInDays($loan->due_date) }} days</span>
            </div>
            <div class="detail-row">
                <span class="label">Processed by:</span>
                <span class="value">{{ $loan->transaction->attendant->first_name }} {{ $loan->transaction->attendant->last_name }}</span>
            </div>
        </div>

        <div class="due-date-highlight">
            <strong>📅 Important: Return Date</strong><br>
            Please return this book by <strong>{{ $loan->due_date->format('l, F j, Y') }}</strong><br>
            <small>({{ $loan->loan_date->diffInDays($loan->due_date) }} days from today)</small>
        </div>

        <div class="important-info">
            <strong>📋 Loan Terms & Conditions:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Books must be returned by the due date to avoid late fees</li>
                <li>Late fee: $5.00 per day after the due date</li>
                <li>Books may be renewed if no one else has reserved them</li>
                <li>Please keep the book in good condition</li>
                <li>Report any damage or loss immediately</li>
            </ul>
        </div>

        <div class="reminder">
            <strong>🔔 Helpful Reminders:</strong><br>
            • You'll receive email reminders 3 days before the due date<br>
            • You can return the book early without any penalty<br>
            • Renewal requests must be made at least 1 day before the due date<br>
            • Check our library hours before visiting for returns
        </div>

        <div class="contact-info">
            <strong>Need Help?</strong><br>
            Visit the library desk or contact us if you have any questions about your loan.<br>
            <small>Library Hours: Monday-Friday 8:00 AM - 8:00 PM | Saturday 9:00 AM - 5:00 PM</small>
        </div>

        <div class="footer">
            <p><strong>Thank you for choosing Eversun Library!</strong></p>
            <p>We hope you enjoy reading "<strong>{{ $loan->book->book_title }}</strong>"</p>
            <p>Happy reading! 📖</p>
            <p style="margin-top: 20px;">
                <small>This is an automated message. Please do not reply to this email.</small>
            </p>
        </div>
    </div>
</body>
</html>
