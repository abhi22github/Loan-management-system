import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // REMOVE this import if it exists

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State to manage payment input for each loan
    const [paymentAmount, setPaymentAmount] = useState({});
    const [paymentDate, setPaymentDate] = useState({});
    const [paymentMessage, setPaymentMessage] = useState({}); // To show individual payment success/error messages

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/loans');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const processedData = data.map(loan => ({
                    ...loan,
                    principalAmount: loan.principalAmount ? parseFloat(loan.principalAmount) : null,
                    // Ensure outstandingPrincipal is parsed correctly
                    outstandingPrincipal: loan.outstandingPrincipal ? parseFloat(loan.outstandingPrincipal) : null,
                    interestRate: loan.interestRate ? parseFloat(loan.interestRate) : null
                }));
                setLoans(processedData);

                // Initialize payment input states for all loans
                const initialPaymentAmounts = {};
                const initialPaymentDates = {};
                processedData.forEach(loan => {
                    initialPaymentAmounts[loan.id] = '';
                    initialPaymentDates[loan.id] = new Date().toISOString().slice(0, 10); // Current date
                });
                setPaymentAmount(initialPaymentAmounts);
                setPaymentDate(initialPaymentDates);

            } catch (err) {
                console.error("Failed to fetch loans:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    // Handler for payment amount input changes
    const handlePaymentAmountChange = (loanId, value) => {
        setPaymentAmount(prev => ({ ...prev, [loanId]: value }));
        setPaymentMessage(prev => ({ ...prev, [loanId]: null })); // Clear message on input change
    };

    // Handler for payment date input changes
    const handlePaymentDateChange = (loanId, value) => {
        setPaymentDate(prev => ({ ...prev, [loanId]: value }));
        setPaymentMessage(prev => ({ ...prev, [loanId]: null })); // Clear message on input change
    };


    // Handler to record a payment
    const recordPayment = async (loanId) => {
        const amount = parseFloat(paymentAmount[loanId]);
        const date = paymentDate[loanId];

        if (isNaN(amount) || amount <= 0 || !date) {
            setPaymentMessage(prev => ({ ...prev, [loanId]: { text: 'Please enter a valid positive amount and date.', isError: true } }));
            return;
        }

        const loanToUpdate = loans.find(loan => loan.id === loanId);
        if (loanToUpdate && loanToUpdate.status === 'PAID') {
            setPaymentMessage(prev => ({ ...prev, [loanId]: { text: 'Loan is already fully paid.', isError: true } }));
            return;
        }

        setPaymentMessage(prev => ({ ...prev, [loanId]: { text: 'Processing payment...', isError: false } }));

        try {
            const response = await fetch(`http://localhost:8080/api/loans/${loanId}/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    paymentDate: date
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to read error message from backend
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // After successful payment, re-fetch the specific loan to get the most accurate
            // outstanding principal and status, and its updated payments list.
            // This is crucial for reflecting correct state from backend.
            const updatedLoanResponse = await fetch(`http://localhost:8080/api/loans/${loanId}`);
            if (!updatedLoanResponse.ok) {
                 throw new Error(`Failed to re-fetch loan after payment: ${updatedLoanResponse.status}`);
            }
            const updatedLoanData = await updatedLoanResponse.json();
            const processedUpdatedLoan = {
                ...updatedLoanData,
                principalAmount: updatedLoanData.principalAmount ? parseFloat(updatedLoanData.principalAmount) : null,
                outstandingPrincipal: updatedLoanData.outstandingPrincipal ? parseFloat(updatedLoanData.outstandingPrincipal) : null,
                interestRate: updatedLoanData.interestRate ? parseFloat(updatedLoanData.interestRate) : null
            };


            setLoans(prevLoans => prevLoans.map(loan => {
                if (loan.id === loanId) {
                    return processedUpdatedLoan; // Replace with the fully updated loan object
                }
                return loan;
            }));

            setPaymentMessage(prev => ({ ...prev, [loanId]: { text: 'Payment recorded successfully!', isError: false } }));
            setPaymentAmount(prev => ({ ...prev, [loanId]: '' })); // Clear input after successful payment

        } catch (err) {
            console.error("Error recording payment:", err);
            setPaymentMessage(prev => ({ ...prev, [loanId]: { text: `Failed to record payment: ${err.message}`, isError: true } }));
        }
    };


    if (loading) {
        return <div style={{ color: '#e0e0e0' }}>Loading loans...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>All Loans</h1>
            {loans.length === 0 ? (
                <p>No loans found. Create one!</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {loans.map(loan => (
                        <li key={loan.id} style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            margin: '10px 0',
                            padding: '15px',
                            backgroundColor: '#f9f9f9',
                            color: '#333' // Ensure text is dark on light background
                        }}>
                            {/* Removed Link here */}
                            <h2>Loan ID: {loan.id}</h2>
                            <p><strong>Borrower:</strong> {loan.borrowerName}</p>
                            <p><strong>Principal:</strong> ${loan.principalAmount !== null ? loan.principalAmount.toFixed(2) : 'N/A'}</p>
                            <p><strong>Outstanding:</strong> ${loan.outstandingPrincipal !== null ? loan.outstandingPrincipal.toFixed(2) : 'N/A'}</p>
                            <p><strong>Interest Rate:</strong> {loan.interestRate !== null ? (loan.interestRate * 100).toFixed(2) : 'N/A'}%</p>
                            <p><strong>Term:</strong> {loan.termMonths} months</p>
                            <p><strong>Start Date:</strong> {loan.startDate}</p>
                            <p><strong>End Date:</strong> {loan.endDate || 'N/A'}</p>
                            <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: loan.status === 'PAID' ? 'green' : (loan.status === 'ACTIVE' ? 'blue' : 'orange') }}>{loan.status}</span></p>

                            {/* Payment Section */}
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ddd' }}>
                                <h3>Record Payment</h3>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={paymentAmount[loan.id] || ''}
                                    onChange={(e) => handlePaymentAmountChange(loan.id, e.target.value)}
                                    disabled={loan.status === 'PAID'}
                                    style={{ width: '100px', marginRight: '10px', padding: '5px', color: '#333', backgroundColor: '#f0f0f0' }}
                                />
                                <input
                                    type="date"
                                    value={paymentDate[loan.id] || ''}
                                    onChange={(e) => handlePaymentDateChange(loan.id, e.target.value)}
                                    disabled={loan.status === 'PAID'}
                                    style={{ width: '120px', marginRight: '10px', padding: '5px', color: '#333', backgroundColor: '#f0f0f0' }}
                                />
                                <button
                                    onClick={() => recordPayment(loan.id)}
                                    disabled={loan.status === 'PAID'}
                                    style={{
                                        padding: '8px 15px',
                                        backgroundColor: loan.status === 'PAID' ? '#ccc' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: loan.status === 'PAID' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loan.status === 'PAID' ? 'Paid' : 'Pay'}
                                </button>
                                {paymentMessage[loan.id] && (
                                    <p style={{
                                        color: paymentMessage[loan.id].isError ? 'red' : 'green',
                                        fontSize: '0.9em',
                                        marginTop: '5px'
                                    }}>
                                        {paymentMessage[loan.id].text}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LoanList;