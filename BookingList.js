import React, { useState } from 'react';

function BookingList() {
  // Initialize with an empty list of bookings
  const [bookings, setBookings] = useState([]);

  // State to hold new booking details for adding new bookings
  const [newBooking, setNewBooking] = useState({
    bookingDate: '',
    paymentStatus: 'Pending', // Default status is 'Pending'
  });

  // Function to add new booking
  const addBooking = () => {
    if (!newBooking.bookingDate) {
      alert('Please select a booking date');
      return;
    }

    const newBookingId = bookings.length + 1; // Generate new unique booking ID
    setBookings([...bookings, { bookingId: newBookingId, ...newBooking }]);
    setNewBooking({ bookingDate: '', paymentStatus: 'Pending' }); // Clear the form
  };

  return (
    <div className="booking-list-container">
      <h2>Booking List</h2>

      {/* Add new booking form */}
      <div className="add-booking-form">
        <input
          type="date"
          value={newBooking.bookingDate}
          onChange={(e) => setNewBooking({ ...newBooking, bookingDate: e.target.value })}
        />
        <select
          value={newBooking.paymentStatus}
          onChange={(e) => setNewBooking({ ...newBooking, paymentStatus: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
        <button onClick={addBooking}>Add Booking</button>
      </div>

      {/* Display existing bookings */}
      {bookings.length === 0 ? (
        <p>No bookings recorded yet.</p> // Message when there are no bookings
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.bookingId} className="booking-item">
              <p><strong>Booking ID:</strong> {booking.bookingId}</p>
              <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
              <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingList;
