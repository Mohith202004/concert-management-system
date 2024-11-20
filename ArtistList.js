import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArtistList() {
  // State to hold the list of artists
  const [artists, setArtists] = useState([]);

  // State for each input field for a new artist
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [genre, setGenre] = useState('');

  // Fetch artists from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/api/artist')
      .then((response) => {
        setArtists(response.data);
      })
      .catch((error) => {
        console.error('Error fetching artists:', error);
      });
  }, []);

  // Function to add a new artist (POST request to backend)
  const addArtist = async () => {
    if (name && id && socialMedia && genre) {
      const newArtist = {
        name: name,
        id: id,
        socialMedia: socialMedia,
        genre: genre,
      };

      try {
        const response = await axios.post('http://localhost:3001/api/artist', newArtist);
        setArtists([...artists, response.data]); // Update artist list with the new artist
        clearForm(); // Clear input fields
      } catch (error) {
        console.error('Error adding artist:', error);
        alert('There was an error adding the artist. Please try again.');
      }
    } else {
      alert('Please fill in all fields!');
    }
  };

  // Function to remove an artist (DELETE request to backend)
  const removeArtist = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/artist/${id}`);
      setArtists(artists.filter(artist => artist.artist_id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting artist:', error);
      alert('There was an error deleting the artist. Please try again.');
    }
  };

  // Clear input fields after adding an artist
  const clearForm = () => {
    setName('');
    setId('');
    setSocialMedia('');
    setGenre('');
  };

  return (
    <div className="artist-list-container">
      <h2>Artist List</h2>

      {/* Form to add a new artist */}
      <div className="add-artist-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Artist Name"
        />
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Artist ID"
        />
        <input
          type="text"
          value={socialMedia}
          onChange={(e) => setSocialMedia(e.target.value)}
          placeholder="Social Media"
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
        />
        <button onClick={addArtist}>Add Artist</button>
      </div>

      {/* List of artists */}
      <ul>
        {artists.map((artist) => (
          <li key={artist.artist_id} className="artist-item">
            <div className="artist-details">
              <h3>{artist.artist_name}</h3>
              <p><strong>ID:</strong> {artist.artist_id}</p>
              <p><strong>Social Media:</strong> {artist.social_media}</p>
              <p><strong>Genre:</strong> {artist.genre}</p>
            </div>
            <button onClick={() => removeArtist(artist.artist_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArtistList;
