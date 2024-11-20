import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({
    name: '',
    capacity: '',
    location: '',
    address: '',
    contact_info: ''
  });

  // Fetch venues from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/venues')
      .then((response) => {
        setVenues(response.data);
      })
      .catch((error) => {
        console.error('Error fetching venues:', error);
      });
  }, []);

  // Add a new venue (POST request)
  const addVenue = async () => {
    const { name, capacity, location, address, contact_info } = newVenue;
    if (!name || !capacity || !location || !address || !contact_info) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/venues', newVenue);
      setVenues([...venues, response.data]);
      setNewVenue({ name: '', capacity: '', location: '', address: '', contact_info: '' });
    } catch (error) {
      console.error('Error adding venue:', error);
      alert('There was an error adding the venue. Please try again.');
    }
  };

  // Delete a venue (DELETE request)
  const deleteVenue = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/venues/${id}`);
      setVenues(venues.filter((venue) => venue.venue_id !== id));
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('There was an error deleting the venue. Please try again.');
    }
  };

  // Update a venue (PUT request)
  const updateVenue = async (id) => {
    const venueToUpdate = venues.find((venue) => venue.venue_id === id);
    if (!venueToUpdate) {
      alert('Venue not found');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/venues/${id}`, venueToUpdate);
      setVenues(venues.map((venue) => (venue.venue_id === id ? response.data : venue)));
      alert('Venue updated successfully');
    } catch (error) {
      console.error('Error updating venue:', error);
      alert('There was an error updating the venue. Please try again.');
    }
  };

  return (
    <div>
      <h2>Venue List</h2>
      <div className="add-venue-form">
        <input
          type="text"
          placeholder="Name"
          value={newVenue.name}
          onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newVenue.capacity}
          onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newVenue.location}
          onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newVenue.address}
          onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={newVenue.contact_info}
          onChange={(e) => setNewVenue({ ...newVenue, contact_info: e.target.value })}
        />
        <button onClick={addVenue}>Add Venue</button>
      </div>
      <ul>
        {venues.map((venue) => (
          <li key={venue.venue_id}>
            <p><strong>Name:</strong> {venue.name}</p>
            <p><strong>Capacity:</strong> {venue.capacity}</p>
            <p><strong>Location:</strong> {venue.location}</p>
            <p><strong>Address:</strong> {venue.address}</p>
            <p><strong>Contact Info:</strong> {venue.contact_info}</p>
            <button onClick={() => deleteVenue(venue.venue_id)}>Delete</button>
            <button onClick={() => updateVenue(venue.venue_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VenueList;
