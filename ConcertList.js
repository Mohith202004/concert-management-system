import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConcertList() {
  // State to hold the list of concert
  const [concert, setconcert] = useState([]);

  // State for each input field
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  // Fetch concert from backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/api/concert')
      .then((response) => {
        setconcert(response.data);
      })
      .catch((error) => {
        console.error('Error fetching concert:', error);
      });
  }, []);

  // Function to add a new concert (POST request to backend)
  const addConcert = async () => {
    if (name && date && startTime && endTime && status && description) {
      const newConcert = {
        concert_name: name,
        concert_date: date,
        start_time: startTime,
        end_time: endTime,
        status: status,
        description: description,
      };

      try {
        const response = await axios.post('http://localhost:3001/api/concert', newConcert);
        setconcert([...concert, response.data]); // Update concert list with the new concert
        clearForm(); // Clear input fields
      } catch (error) {
        console.error('Error adding concert:', error);
        alert('There was an error adding the concert. Please try again.');
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  // Function to remove a concert (DELETE request to backend)
  const removeConcert = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/concert/${id}`);
      setconcert(concert.filter(concert => concert.concert_id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting concert:', error);
      alert('There was an error deleting the concert. Please try again.');
    }
  };

  // Clear input fields after adding a concert
  const clearForm = () => {
    setName('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setStatus('');
    setDescription('');
  };

  return (
    <div className="concert-list-container">
      <h2>Concert List</h2>

      {/* Form to add a new concert */}
      <div className="add-concert-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Concert Name"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Concert Description"
        />
        <button onClick={addConcert}>Add Concert</button>
      </div>

      {/* List of concert */}
      <ul>
        {concert.map((concert) => (
          <li key={concert.concert_id} className="concert-item">
            <div className="concert-details">
              <h3>{concert.concert_name}</h3>
              <p><strong>Date:</strong> {concert.concert_date}</p>
              <p><strong>Start Time:</strong> {concert.start_time}</p>
              <p><strong>End Time:</strong> {concert.end_time}</p>
              <p><strong>Status:</strong> {concert.status}</p>
              <p><strong>Description:</strong> {concert.description}</p>
            </div>
            <button onClick={() => removeConcert(concert.concert_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConcertList;
