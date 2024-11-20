import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    booking_id: '',
    payment_date: '',
    amount: '',
    payment_method: 'Credit Card'
  });

  // Fetch payments from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/payments')
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
      });
  }, []);

  // Add a new payment (POST request)
  const addPayment = async () => {
    const { booking_id, payment_date, amount, payment_method } = newPayment;
    if (!booking_id || !payment_date || !amount || !payment_method) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/payments', newPayment);
      setPayments([...payments, response.data]);
      setNewPayment({
        booking_id: '',
        payment_date: '',
        amount: '',
        payment_method: 'Credit Card'
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('There was an error adding the payment. Please try again.');
    }
  };

  // Delete a payment (DELETE request)
  const deletePayment = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/payments/${id}`);
      setPayments(payments.filter((payment) => payment.payment_id !== id));
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('There was an error deleting the payment. Please try again.');
    }
  };

  // Update a payment (PUT request)
  const updatePayment = async (id) => {
    const paymentToUpdate = payments.find((payment) => payment.payment_id === id);
    if (!paymentToUpdate) {
      alert('Payment not found');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/payments/${id}`, paymentToUpdate);
      setPayments(payments.map((payment) => (payment.payment_id === id ? response.data : payment)));
      alert('Payment updated successfully');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('There was an error updating the payment. Please try again.');
    }
  };

  return (
    <div>
      <h2>Payment List</h2>
      <div className="add-payment-form">
        <input
          type="number"
          placeholder="Booking ID"
          value={newPayment.booking_id}
          onChange={(e) => setNewPayment({ ...newPayment, booking_id: e.target.value })}
        />
        <input
          type="date"
          placeholder="Payment Date"
          value={newPayment.payment_date}
          onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
        />
        <select
          value={newPayment.payment_method}
          onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash">Cash</option>
          <option value="Online Payment">Online Payment</option>
        </select>
        <button onClick={addPayment}>Add Payment</button>
      </div>
      <ul>
        {payments.map((payment) => (
          <li key={payment.payment_id}>
            <p><strong>Booking ID:</strong> {payment.booking_id}</p>
            <p><strong>Payment Date:</strong> {payment.payment_date}</p>
            <p><strong>Amount:</strong> {payment.amount}</p>
            <p><strong>Payment Method:</strong> {payment.payment_method}</p>
            <button onClick={() => deletePayment(payment.payment_id)}>Delete</button>
            <button onClick={() => updatePayment(payment.payment_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentList;
