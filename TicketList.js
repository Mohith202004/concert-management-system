import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    concert_id: '',
    ticket_type: 'Regular',
    price: '',
    availability_status: 'Available'
  });

  // Fetch tickets from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/tickets')
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  // Add a new ticket
  const addTicket = async () => {
    const { concert_id, ticket_type, price, availability_status } = newTicket;
    if (!ticket_type || !price) {
      alert('Please provide ticket type and price');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/tickets', newTicket);
      setTickets([...tickets, response.data]);
      setNewTicket({
        concert_id: '',
        ticket_type: 'Regular',
        price: '',
        availability_status: 'Available'
      });
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('There was an error adding the ticket. Please try again.');
    }
  };

  // Delete a ticket
  const deleteTicket = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tickets/${id}`);
      setTickets(tickets.filter((ticket) => ticket.ticket_id !== id));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('There was an error deleting the ticket. Please try again.');
    }
  };

  // Update a ticket
  const updateTicket = async (id) => {
    const ticketToUpdate = tickets.find((ticket) => ticket.ticket_id === id);
    if (!ticketToUpdate) {
      alert('Ticket not found');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/tickets/${id}`, ticketToUpdate);
      setTickets(tickets.map((ticket) => (ticket.ticket_id === id ? response.data : ticket)));
      alert('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('There was an error updating the ticket. Please try again.');
    }
  };

  return (
    <div>
      <h2>Ticket List</h2>
      <div className="add-ticket-form">
        <input
          type="number"
          placeholder="Concert ID (optional)"
          value={newTicket.concert_id}
          onChange={(e) => setNewTicket({ ...newTicket, concert_id: e.target.value })}
        />
        <select
          value={newTicket.ticket_type}
          onChange={(e) => setNewTicket({ ...newTicket, ticket_type: e.target.value })}
        >
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
          <option value="VVIP">VVIP</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={newTicket.price}
          onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })}
        />
        <select
          value={newTicket.availability_status}
          onChange={(e) => setNewTicket({ ...newTicket, availability_status: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Sold Out">Sold Out</option>
        </select>
        <button onClick={addTicket}>Add Ticket</button>
      </div>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.ticket_id}>
            <p><strong>Concert Name:</strong> {ticket.concert_name || 'N/A'}</p>
            <p><strong>Type:</strong> {ticket.ticket_type}</p>
            <p><strong>Price:</strong> {ticket.price}</p>
            <p><strong>Status:</strong> {ticket.availability_status}</p>
            <button onClick={() => deleteTicket(ticket.ticket_id)}>Delete</button>
            <button onClick={() => updateTicket(ticket.ticket_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
