import { useEffect } from 'react';
import { router } from '@inertiajs/react';

interface TransactionStatusUpdate {
    transaction: {
        id: number;
        status: string;
        old_status: string;
        new_status: string;
        student: {
            id: number;
            first_name: string;
            last_name: string;
        };
        attendant: {
            id: number;
            first_name: string;
            last_name: string;
        };
        loans: Array<{
            id: number;
            status: string;
            book: {
                id: number;
                book_title: string;
                author: string;
            };
        }>;
    };
    timestamp: string;
}

interface LoanStatusUpdate {
    loan: {
        id: number;
        status: string;
        old_status: string;
        new_status: string;
        loan_date: string;
        due_date: string;
        return_date?: string;
        payment_amount: number;
        book: {
            id: number;
            book_title: string;
            author: string;
        };
        transaction: {
            id: number;
            student: {
                id: number;
                first_name: string;
                last_name: string;
            };
            attendant: {
                id: number;
                first_name: string;
                last_name: string;
            };
        };
    };
    timestamp: string;
}

export function useTransactionUpdates() {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo) {
            // Listen for transaction status changes
            const channel = window.Echo.channel('transactions');

            channel.listen('.transaction.status.changed', (data: TransactionStatusUpdate) => {
                console.log('Transaction status changed:', data);

                // Show a notification (you can customize this)
                const studentName = `${data.transaction.student.first_name} ${data.transaction.student.last_name}`;
                const message = `Transaction #${data.transaction.id} for ${studentName} has been ${data.transaction.new_status}`;

                // You can replace this with a toast notification library
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Transaction Update', {
                        body: message,
                        icon: '/favicon.ico',
                    });
                }

                // Reload the current page to reflect changes
                router.reload({ only: ['transactions', 'loans', 'stats'] });
            });

            // Listen for loan status changes
            const loanChannel = window.Echo.channel('loans');

            loanChannel.listen('.loan.status.changed', (data: LoanStatusUpdate) => {
                console.log('Loan status changed:', data);

                // Show a notification for loan status changes
                const studentName = `${data.loan.transaction.student.first_name} ${data.loan.transaction.student.last_name}`;
                const bookTitle = data.loan.book.book_title;

                let message = '';
                if (data.loan.new_status === 'active' && data.loan.old_status === 'new') {
                    message = `${studentName} has borrowed "${bookTitle}"`;
                } else if (data.loan.new_status === 'returned') {
                    message = `${studentName} has returned "${bookTitle}"`;
                } else {
                    message = `${studentName}'s loan for "${bookTitle}" status changed to ${data.loan.new_status}`;
                }

                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Library Update', {
                        body: message,
                        icon: '/favicon.ico',
                    });
                }

                // Reload the current page to reflect loan changes and dashboard stats
                router.reload({ only: ['loans', 'transactions', 'stats'] });
            });

            // Also listen for transaction changes that affect loans
            loanChannel.listen('.transaction.status.changed', (data: TransactionStatusUpdate) => {
                console.log('Loan status updated via transaction:', data);

                // Reload the current page to reflect loan changes and dashboard stats
                router.reload({ only: ['loans', 'transactions', 'stats'] });
            });

            // Request notification permission if not already granted
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }

            // Cleanup on unmount
            return () => {
                channel.stopListening('.transaction.status.changed');
                loanChannel.stopListening('.loan.status.changed');
                loanChannel.stopListening('.transaction.status.changed');
            };
        }
    }, []);
}

export function useLoanUpdates() {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo) {
            // Listen for transaction changes that affect loans
            const transactionChannel = window.Echo.channel('transactions');
            const loanChannel = window.Echo.channel('loans');

            transactionChannel.listen('.transaction.status.changed', (data: TransactionStatusUpdate) => {
                console.log('Loan data updated via transaction:', data);

                // If the transaction has loans, refresh the loans data and dashboard stats
                if (data.transaction.loans && data.transaction.loans.length > 0) {
                    router.reload({ only: ['loans', 'stats'] });
                }
            });

            // Listen for direct loan status changes (like book returns)
            loanChannel.listen('.loan.status.changed', (data: LoanStatusUpdate) => {
                console.log('Loan status changed directly:', data);

                // Refresh the loans data and dashboard stats
                router.reload({ only: ['loans', 'stats'] });
            });

            return () => {
                transactionChannel.stopListening('.transaction.status.changed');
                loanChannel.stopListening('.loan.status.changed');
            };
        }
    }, []);
}

export function useDashboardUpdates() {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo) {
            // Listen for both transaction and loan changes to update dashboard stats
            const transactionChannel = window.Echo.channel('transactions');
            const loanChannel = window.Echo.channel('loans');

            // Handle transaction status changes that affect stats
            transactionChannel.listen('.transaction.status.changed', (data: TransactionStatusUpdate) => {
                console.log('📊 Dashboard stats updated via transaction:', data.transaction.id, 'Status:', data.transaction.new_status);

                // Reload only the stats data to update dashboard
                router.reload({ only: ['stats'] });
            });

            // Handle loan status changes that affect stats (borrowing, returning)
            loanChannel.listen('.loan.status.changed', (data: LoanStatusUpdate) => {
                console.log('📊 Dashboard stats updated via loan:', data.loan.id, 'Status:', data.loan.new_status);

                // Reload only the stats data to update dashboard
                router.reload({ only: ['stats'] });
            });

            // Debug: Log when channels are established
            console.log('🔗 Dashboard WebSocket channels established for real-time stats updates');

            return () => {
                transactionChannel.stopListening('.transaction.status.changed');
                loanChannel.stopListening('.loan.status.changed');
                console.log('🔌 Dashboard WebSocket channels disconnected');
            };
        } else {
            console.warn('⚠️ WebSocket (Echo) not available for dashboard updates');
        }
    }, []);
}
