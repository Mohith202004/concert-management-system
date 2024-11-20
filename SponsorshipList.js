import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SponsorshipList() {
  const [sponsorships, setSponsorships] = useState([]);
  const [newSponsorship, setNewSponsorship] = useState({
    sponsor_name: '',
    contact: '',
    concert_id: ''
  });

  // Fetch sponsorships from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/sponsorships')
      .then((response) => {
        setSponsorships(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sponsorships:', error);
      });
  }, []);

  // Add a new sponsorship
  const addSponsorship = async () => {
    const { sponsor_name, contact, concert_id } = newSponsorship;
    if (!sponsor_name || !contact) {
      alert('Please provide sponsor name and contact');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/sponsorships', newSponsorship);
      setSponsorships([...sponsorships, response.data]);
      setNewSponsorship({
        sponsor_name: '',
        contact: '',
        concert_id: ''
      });
    } catch (error) {
      console.error('Error adding sponsorship:', error);
      alert('There was an error adding the sponsorship. Please try again.');
    }
  };

  // Delete a sponsorship
  const deleteSponsorship = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/sponsorships/${id}`);
      setSponsorships(sponsorships.filter((sponsorship) => sponsorship.sponsorship_id !== id));
    } catch (error) {
      console.error('Error deleting sponsorship:', error);
      alert('There was an error deleting the sponsorship. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sponsorship List</h2>
      <div className="add-sponsorship-form">
        <input
          type="text"
          placeholder="Sponsor Name"
          value={newSponsorship.sponsor_name}
          onChange={(e) => setNewSponsorship({ ...newSponsorship, sponsor_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={newSponsorship.contact}
          onChange={(e) => setNewSponsorship({ ...newSponsorship, contact: e.target.value })}
        />
        <input
          type="number"
          placeholder="Concert ID (optional)"
          value={newSponsorship.concert_id}
          onChange={(e) => setNewSponsorship({ ...newSponsorship, concert_id: e.target.value })}
        />
        <button onClick={addSponsorship}>Add Sponsorship</button>
      </div>
      <ul>
        {sponsorships.map((sponsorship) => (
          <li key={sponsorship.sponsorship_id}>
            <p><strong>Name:</strong> {sponsorship.sponsor_name}</p>
            <p><strong>Contact:</strong> {sponsorship.contact}</p>
            <p><strong>Concert Name:</strong> {sponsorship.concert_name || 'N/A'}</p>
            <button onClick={() => deleteSponsorship(sponsorship.sponsorship_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SponsorshipList;
