import React, { useState } from 'react';

// LoanForm component receives a prop: onLoanCreated
// This prop is a function that will be called after a loan is successfully created,
// allowing the parent component (App.jsx or LoanList) to refresh the list of loans.
const LoanForm = ({ onLoanCreated }) => {
    // State to hold the form data
    const [loanData, setLoanData] = useState({
        principalAmount: '',
        interestRate: '',
        termMonths: '',
        startDate: '', // YYYY-MM-DD format
        borrowerName: ''
    });
    // State for loading/submission status
    const [submitting, setSubmitting] = useState(false);
    // State for success/error messages
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setSubmitting(true);
        setMessage(null);
        setIsError(false);

        try {
            // Validate basic inputs before sending
            if (!loanData.principalAmount || !loanData.interestRate || !loanData.termMonths || !loanData.startDate || !loanData.borrowerName) {
                throw new Error("All fields are required.");
            }
            if (parseFloat(loanData.principalAmount) <= 0 || parseFloat(loanData.interestRate) <= 0 || parseInt(loanData.termMonths) <= 0) {
                throw new Error("Principal, interest rate, and term must be positive numbers.");
            }

            const response = await fetch('http://localhost:8080/api/loans', {
                method: 'POST', // Specify POST method
                headers: {
                    'Content-Type': 'application/json', // Tell the server we're sending JSON
                },
                // Convert loanData state to JSON string
                body: JSON.stringify({
                    principalAmount: parseFloat(loanData.principalAmount), // Ensure numbers are sent as numbers
                    interestRate: parseFloat(loanData.interestRate),
                    termMonths: parseInt(loanData.termMonths),
                    startDate: loanData.startDate,
                    borrowerName: loanData.borrowerName
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to read error message from backend
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Loan created successfully
            const newLoan = await response.json();
            setMessage(`Loan created successfully! ID: ${newLoan.id}`);
            setIsError(false);

            // Clear the form
            setLoanData({
                principalAmount: '',
                interestRate: '',
                termMonths: '',
                startDate: '',
                borrowerName: ''
            });

            // Call the callback prop to notify parent component
            if (onLoanCreated) {
                onLoanCreated();
            }

        } catch (err) {
            console.error("Error creating loan:", err);
            setMessage(`Failed to create loan: ${err.message}`);
            setIsError(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid #eee',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: '#fff'
        }}>
            <h2>Create New Loan</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                <div>
                    <label htmlFor="borrowerName">Borrower Name:</label>
                    <input
                        type="text"
                        id="borrowerName"
                        name="borrowerName"
                        value={loanData.borrowerName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="principalAmount">Principal Amount:</label>
                    <input
                        type="number" // Use type="number" for numerical inputs
                        id="principalAmount"
                        name="principalAmount"
                        value={loanData.principalAmount}
                        onChange={handleChange}
                        required
                        step="0.01" // Allow decimal values
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="interestRate">Interest Rate (e.g., 0.05 for 5%):</label>
                    <input
                        type="number"
                        id="interestRate"
                        name="interestRate"
                        value={loanData.interestRate}
                        onChange={handleChange}
                        required
                        step="0.0001" // Allow small decimal for rates
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="termMonths">Term (Months):</label>
                    <input
                        type="number"
                        id="termMonths"
                        name="termMonths"
                        value={loanData.termMonths}
                        onChange={handleChange}
                        required
                        min="1" // Minimum 1 month
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date" // Use type="date" for date picker
                        id="startDate"
                        name="startDate"
                        value={loanData.startDate}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" disabled={submitting} style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                }}>
                    {submitting ? 'Creating...' : 'Create Loan'}
                </button>
            </form>
            {message && (
                <p style={{ color: isError ? 'red' : 'green', marginTop: '10px' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoanForm;