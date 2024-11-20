import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrganizerList() {
  const [organizers, setOrganizers] = useState([]);
  const [newOrganizer, setNewOrganizer] = useState({
    name: '',
    contact_info: '',
    email: ''
  });

  // Fetch organizers from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/organizers')
      .then((response) => {
        setOrganizers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching organizers:', error);
      });
  }, []);

  // Add a new organizer (POST request)
  const addOrganizer = async () => {
    const { name, contact_info, email } = newOrganizer;
    if (!name || !contact_info || !email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/organizers', newOrganizer);
      setOrganizers([...organizers, response.data]);
      setNewOrganizer({ name: '', contact_info: '', email: '' });
    } catch (error) {
      console.error('Error adding organizer:', error);
      alert('There was an error adding the organizer. Please try again.');
    }
  };

  // Delete an organizer (DELETE request)
  const deleteOrganizer = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/organizers/${id}`);
      setOrganizers(organizers.filter((organizer) => organizer.organizer_id !== id));
    } catch (error) {
      console.error('Error deleting organizer:', error);
      alert('There was an error deleting the organizer. Please try again.');
    }
  };

  // Update an organizer (PUT request)
  const updateOrganizer = async (id) => {
    const organizerToUpdate = organizers.find((organizer) => organizer.organizer_id === id);
    if (!organizerToUpdate) {
      alert('Organizer not found');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/organizers/${id}`, organizerToUpdate);
      setOrganizers(organizers.map((organizer) => (organizer.organizer_id === id ? response.data : organizer)));
      alert('Organizer updated successfully');
    } catch (error) {
      console.error('Error updating organizer:', error);
      alert('There was an error updating the organizer. Please try again.');
    }
  };

  return (
    <div>
      <h2>Organizer List</h2>
      <div className="add-organizer-form">
        <input
          type="text"
          placeholder="Name"
          value={newOrganizer.name}
          onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={newOrganizer.contact_info}
          onChange={(e) => setNewOrganizer({ ...newOrganizer, contact_info: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newOrganizer.email}
          onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
        />
        <button onClick={addOrganizer}>Add Organizer</button>
      </div>
      <ul>
        {organizers.map((organizer) => (
          <li key={organizer.organizer_id}>
            <p><strong>Name:</strong> {organizer.name}</p>
            <p><strong>Contact Info:</strong> {organizer.contact_info}</p>
            <p><strong>Email:</strong> {organizer.email}</p>
            <button onClick={() => deleteOrganizer(organizer.organizer_id)}>Delete</button>
            <button onClick={() => updateOrganizer(organizer.organizer_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrganizerList;
