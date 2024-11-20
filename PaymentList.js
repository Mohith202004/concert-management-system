import React, { useState } from 'react';

function PaymentList() {
  // Initial Payment Data
  const [payments, setPayments] = useState([
    { paymentId: 1, method: 'Credit Card', paymentDate: '2024-11-01', amount: 100, status: 'Completed' },
    { paymentId: 2, method: 'PayPal', paymentDate: '2024-11-05', amount: 50, status: 'Pending' },
  ]);

  // State to hold new payment details for adding new payments
  const [newPayment, setNewPayment] = useState({
    method: '',
    paymentDate: '',
    amount: '',
    status: 'Pending', // Default status can be 'Pending'
  });

  // Function to add new payment
  const addPayment = () => {
    const newPaymentId = payments.length + 1; // Generate new unique payment ID
    setPayments([...payments, { paymentId: newPaymentId, ...newPayment }]);
    setNewPayment({ method: '', paymentDate: '', amount: '', status: 'Pending' }); // Clear the form
  };

  return (
    <div className="payment-list-container">
      <h2>Payment List</h2>

      {/* Add new payment form */}
      <div className="add-payment-form">
        <input
          type="text"
          placeholder="Payment Method"
          value={newPayment.method}
          onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
        />
        <input
          type="date"
          value={newPayment.paymentDate}
          onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
        />
        <select
          value={newPayment.status}
          onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={addPayment}>Add Payment</button>
      </div>

      {/* Display existing payments */}
      <ul>
        {payments.map((payment) => (
          <li key={payment.paymentId} className="payment-item">
            <p><strong>Payment ID:</strong> {payment.paymentId}</p>
            <p><strong>Payment Method:</strong> {payment.method}</p>
            <p><strong>Payment Date:</strong> {payment.paymentDate}</p>
            <p><strong>Amount:</strong> ${payment.amount}</p>
            <p><strong>Payment Status:</strong> {payment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentList;
