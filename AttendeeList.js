import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendeeList() {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    contact: '',
    email: '',
    age: '',
    address: ''
  });

  // Fetch attendees from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/attendees')
      .then((response) => {
        setAttendees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching attendees:', error);
      });
  }, []);

  // Add a new attendee (POST request)
  const addAttendee = async () => {
    const { name, contact, email, age, address } = newAttendee;
    if (!name || !contact || !email || !age || !address) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/attendees', newAttendee);
      setAttendees([...attendees, response.data]);
      setNewAttendee({ name: '', contact: '', email: '', age: '', address: '' });
    } catch (error) {
      console.error('Error adding attendee:', error);
      alert('There was an error adding the attendee. Please try again.');
    }
  };

  // Delete an attendee (DELETE request)
  const deleteAttendee = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/attendees/${id}`);
      setAttendees(attendees.filter((attendee) => attendee.attendee_id !== id));
    } catch (error) {
      console.error('Error deleting attendee:', error);
      alert('There was an error deleting the attendee. Please try again.');
    }
  };

  // Update an attendee (PUT request)
  const updateAttendee = async (id) => {
    const attendeeToUpdate = attendees.find((attendee) => attendee.attendee_id === id);
    if (!attendeeToUpdate) {
      alert('Attendee not found');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/attendees/${id}`, attendeeToUpdate);
      setAttendees(attendees.map((attendee) => (attendee.attendee_id === id ? response.data : attendee)));
      alert('Attendee updated successfully');
    } catch (error) {
      console.error('Error updating attendee:', error);
      alert('There was an error updating the attendee. Please try again.');
    }
  };

  return (
    <div>
      <h2>Attendee List</h2>
      <div className="add-attendee-form">
        <input
          type="text"
          placeholder="Name"
          value={newAttendee.name}
          onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact"
          value={newAttendee.contact}
          onChange={(e) => setNewAttendee({ ...newAttendee, contact: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newAttendee.email}
          onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newAttendee.age}
          onChange={(e) => setNewAttendee({ ...newAttendee, age: e.target.value })}
        />
        <textarea
          placeholder="Address"
          value={newAttendee.address}
          onChange={(e) => setNewAttendee({ ...newAttendee, address: e.target.value })}
        />
        <button onClick={addAttendee}>Add Attendee</button>
      </div>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.attendee_id}>
            <p><strong>Name:</strong> {attendee.name}</p>
            <p><strong>Contact:</strong> {attendee.contact}</p>
            <p><strong>Email:</strong> {attendee.email}</p>
            <p><strong>Age:</strong> {attendee.age}</p>
            <p><strong>Address:</strong> {attendee.address}</p>
            <button onClick={() => deleteAttendee(attendee.attendee_id)}>Delete</button>
            <button onClick={() => updateAttendee(attendee.attendee_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendeeList;
