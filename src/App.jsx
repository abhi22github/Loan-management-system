import React, { useState } from 'react'; // Import useState for App component
import './App.css';
import LoanList from './components/loanList'; // Import the LoanList component
import LoanForm from './components/LoanForm'; // Import the LoanForm component

function App() {
  // State to trigger a refresh of the LoanList component
  const [refreshListKey, setRefreshListKey] = useState(0);

  // Function to call when a new loan is successfully created
  const handleLoanCreated = () => {
    setRefreshListKey(prevKey => prevKey + 1); // Increment key to force LoanList re-render
  };

  return (
    <div className="App">
      {/* Render the LoanForm component */}
      <LoanForm onLoanCreated={handleLoanCreated} />

      {/* Render the LoanList component.
          The key prop ensures that LoanList remounts (and re-fetches data)
          whenever refreshListKey changes. */}
      <LoanList key={refreshListKey} />
    </div>
  );
}

export default App;