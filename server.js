const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS to allow requests from frontend (React)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'Mohith@7777',  // Replace with your MySQL password
  database: 'concert_management'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);  // Exit the process if DB connection fails
  }
  console.log('Connected to MySQL database');
});

// Routes for handling API requests

// Get all concert
app.get('/api/concert', (req, res) => {
  connection.query('SELECT * FROM concert', (err, results) => {
    if (err) {
      console.error('Error fetching concert:', err);
      return res.status(500).send({ message: 'Error fetching concert', error: err });
    }
    res.json(results);
  });
});

// Add a new concert
app.post('/api/concert', (req, res) => {
  const { concert_name, concert_date, start_time, end_time, status, description } = req.body;

  if (!concert_name || !concert_date || !start_time || !end_time || !status || !description) {
    return res.status(400).send({ message: 'Please provide all fields' });
  }

  const query = `
    INSERT INTO concert (concert_name, concert_date, start_time, end_time, status, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [concert_name, concert_date, start_time, end_time, status, description], (err, results) => {
    if (err) {
      console.error('Error adding concert:', err);
      return res.status(500).send({ message: 'Error adding concert', error: err });
    }

    res.status(201).send({
      concert_id: results.insertId,
      concert_name,
      concert_date,
      start_time,
      end_time,
      status,
      description
    });
  });
});

// Delete a concert
app.delete('/api/concert/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM concert WHERE concert_id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting concert:', err);
      return res.status(500).send({ message: 'Error deleting concert', error: err });
    }
    
    res.json({ message: 'Concert deleted successfully' });
  });
});

// Get all artists related to concert
// Get all artists
app.get('/api/artist', (req, res) => {
  connection.query('SELECT * FROM artist', (err, results) => {
    if (err) {
      console.error('Error fetching artists:', err);
      return res.status(500).send({ message: 'Error fetching artists', error: err });
    }
    res.json(results);
  });
});

// Add a new artist

app.post('/api/artist', (req, res) => {
  const { name, id, socialMedia, genre } = req.body;

  if (!name || !id || !socialMedia || !genre) {
    return res.status(400).send({ message: 'Please provide all fields' });
  }

  const query = `
    INSERT INTO artist (artist_name, artist_id, social_media, genre)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [name, id, socialMedia, genre], (err, results) => {
    if (err) {
      console.error('Error adding artist:', err);
      return res.status(500).send({ message: 'Error adding artist', error: err });
    }

    res.status(201).send({
      artist_id: id,
      artist_name: name,
      social_media: socialMedia,
      genre: genre
    });
  });
});


// Delete an artist
app.delete('/api/artist/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM artist WHERE artist_id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting artist:', err);
      return res.status(500).send({ message: 'Error deleting artist', error: err });
    }
    
    res.json({ message: 'Artist deleted successfully' });
  });
});

app.get('/api/venues', (req, res) => {
  const query = 'SELECT * FROM Venue';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching venues:', err);
      return res.status(500).send({ message: 'Error fetching venues', error: err });
    }
    res.json(results);
  });
});

// Add a new venue
app.post('/api/venues', (req, res) => {
  const { name, capacity, location, address, contact_info } = req.body;

  if (!name || !capacity || !location || !address || !contact_info) {
    return res.status(400).send({ message: 'Please fill in all fields' });
  }

  const query = `
    INSERT INTO Venue (name, capacity, location, address, contact_info)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [name, capacity, location, address, contact_info], (err, results) => {
    if (err) {
      console.error('Error adding venue:', err);
      return res.status(500).send({ message: 'Error adding venue', error: err });
    }

    res.status(201).send({
      venue_id: results.insertId,
      name,
      capacity,
      location,
      address,
      contact_info
    });
  });
});

// Update a venue
app.put('/api/venues/:id', (req, res) => {
  const { id } = req.params;
  const { name, capacity, location, address, contact_info } = req.body;

  if (!name || !capacity || !location || !address || !contact_info) {
    return res.status(400).send({ message: 'Please fill in all fields' });
  }

  const query = `
    UPDATE Venue
    SET name = ?, capacity = ?, location = ?, address = ?, contact_info = ?
    WHERE venue_id = ?
  `;

  connection.query(query, [name, capacity, location, address, contact_info, id], (err, result) => {
    if (err) {
      console.error('Error updating venue:', err);
      return res.status(500).send({ message: 'Error updating venue', error: err });
    }

    res.json({ message: 'Venue updated successfully' });
  });
});

// Delete a venue
app.delete('/api/venues/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Venue WHERE venue_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting venue:', err);
      return res.status(500).send({ message: 'Error deleting venue', error: err });
    }

    res.json({ message: 'Venue deleted successfully' });
  });
});


// Get all sponsorships with related concert details
// Get all sponsorships
app.get('/api/sponsorships', (req, res) => {
  const query = `
    SELECT 
      s.sponsorship_id, 
      s.sponsor_name, 
      s.contact, 
      s.concert_id, 
      COALESCE(c.concert_name, 'N/A') AS concert_name
    FROM Sponsorship s
    LEFT JOIN Concert c ON s.concert_id = c.concert_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sponsorships:', err);
      return res.status(500).send({ message: 'Error fetching sponsorships', error: err });
    }
    res.json(results);
  });
});


// Add a new sponsorship
app.post('/api/sponsorships', (req, res) => {
  const { sponsor_name, contact, concert_id } = req.body;

  if (!sponsor_name || !contact) {
    return res.status(400).send({ message: 'Please provide sponsor name and contact' });
  }

  const query = `
    INSERT INTO Sponsorship (sponsor_name, contact, concert_id)
    VALUES (?, ?, ?)
  `;
  connection.query(query, [sponsor_name, contact, concert_id || null], (err, results) => {
    if (err) {
      console.error('Error adding sponsorship:', err);
      return res.status(500).send({ message: 'Error adding sponsorship', error: err });
    }

    res.status(201).send({
      sponsorship_id: results.insertId,
      sponsor_name,
      contact,
      concert_id
    });
  });
});

// Delete a sponsorship
app.delete('/api/sponsorships/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Sponsorship WHERE sponsorship_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting sponsorship:', err);
      return res.status(500).send({ message: 'Error deleting sponsorship', error: err });
    }
    res.json({ message: 'Sponsorship deleted successfully' });
  });
});

// Update a sponsorship
app.put('/api/sponsorships/:id', (req, res) => {
  const { id } = req.params;
  const { sponsor_name, contact, concert_id } = req.body;

  if (!sponsor_name || !contact) {
    return res.status(400).send({ message: 'Please provide sponsor name and contact' });
  }

  const query = `
    UPDATE Sponsorship
    SET sponsor_name = ?, contact = ?, concert_id = ?
    WHERE sponsorship_id = ?
  `;
  connection.query(query, [sponsor_name, contact, concert_id || null, id], (err, result) => {
    if (err) {
      console.error('Error updating sponsorship:', err);
      return res.status(500).send({ message: 'Error updating sponsorship', error: err });
    }
    res.json({ message: 'Sponsorship updated successfully' });
  });
});


app.get('/api/organizers', (req, res) => {
  const query = 'SELECT * FROM Organizer';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching organizers:', err);
      return res.status(500).send({ message: 'Error fetching organizers', error: err });
    }
    res.json(results);
  });
});

// Add a new organizer
app.post('/api/organizers', (req, res) => {
  const { name, contact_info, email } = req.body;
  
  if (!name || !contact_info || !email) {
    return res.status(400).send({ message: 'Please provide name, contact_info, and email' });
  }

  const query = 'INSERT INTO Organizer (name, contact_info, email) VALUES (?, ?, ?)';
  connection.query(query, [name, contact_info, email], (err, results) => {
    if (err) {
      console.error('Error adding organizer:', err);
      return res.status(500).send({ message: 'Error adding organizer', error: err });
    }
    
    res.status(201).send({
      organizer_id: results.insertId,
      name,
      contact_info,
      email
    });
  });
});

// Delete an organizer
app.delete('/api/organizers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Organizer WHERE organizer_id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting organizer:', err);
      return res.status(500).send({ message: 'Error deleting organizer', error: err });
    }
    res.json({ message: 'Organizer deleted successfully' });
  });
});

// Update an organizer
app.put('/api/organizers/:id', (req, res) => {
  const { id } = req.params;
  const { name, contact_info, email } = req.body;

  if (!name || !contact_info || !email) {
    return res.status(400).send({ message: 'Please provide name, contact_info, and email' });
  }

  const query = 'UPDATE Organizer SET name = ?, contact_info = ?, email = ? WHERE organizer_id = ?';
  connection.query(query, [name, contact_info, email, id], (err, result) => {
    if (err) {
      console.error('Error updating organizer:', err);
      return res.status(500).send({ message: 'Error updating organizer', error: err });
    }
    res.json({ message: 'Organizer updated successfully' });
  });
});


// Get all tickets related to concert
// Get all tickets
app.get('/api/tickets', (req, res) => {
  const query = `
    SELECT t.ticket_id, t.concert_id, t.ticket_type, t.price, t.availability_status, c.concert_name
    FROM Ticket t
    LEFT JOIN Concert c ON t.concert_id = c.concert_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tickets:', err);
      return res.status(500).send({ message: 'Error fetching tickets', error: err });
    }
    res.json(results);
  });
});

// Add a new ticket
app.post('/api/tickets', (req, res) => {
  const { concert_id, ticket_type, price, availability_status } = req.body;

  if (!ticket_type || !price) {
    return res.status(400).send({ message: 'Please provide ticket type and price' });
  }

  const query = `
    INSERT INTO Ticket (concert_id, ticket_type, price, availability_status)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [concert_id || null, ticket_type, price, availability_status || 'Available'], (err, results) => {
    if (err) {
      console.error('Error adding ticket:', err);
      return res.status(500).send({ message: 'Error adding ticket', error: err });
    }

    res.status(201).send({
      ticket_id: results.insertId,
      concert_id,
      ticket_type,
      price,
      availability_status
    });
  });
});

// Delete a ticket
app.delete('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Ticket WHERE ticket_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting ticket:', err);
      return res.status(500).send({ message: 'Error deleting ticket', error: err });
    }
    res.json({ message: 'Ticket deleted successfully' });
  });
});

// Update a ticket
app.put('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { concert_id, ticket_type, price, availability_status } = req.body;

  if (!ticket_type || !price) {
    return res.status(400).send({ message: 'Please provide ticket type and price' });
  }

  const query = `
    UPDATE Ticket
    SET concert_id = ?, ticket_type = ?, price = ?, availability_status = ?
    WHERE ticket_id = ?
  `;
  connection.query(query, [concert_id || null, ticket_type, price, availability_status, id], (err, result) => {
    if (err) {
      console.error('Error updating ticket:', err);
      return res.status(500).send({ message: 'Error updating ticket', error: err });
    }
    res.json({ message: 'Ticket updated successfully' });
  });
});


// Get all bookings related to tickets
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT b.booking_id, b.booking_date, t.ticket_type, t.price
    FROM bookings b
    LEFT JOIN tickets t ON b.ticket_id = t.ticket_id
  `;
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).send({ message: 'Error fetching bookings', error: err });
    }
    
    res.json(results);
  });
});

// Get all payment details and attendees related to bookings
app.get('/api/payments', (req, res) => {
  const query = `
    SELECT p.payment_id, p.booking_id, p.payment_date, p.amount, p.payment_method, b.booking_date
    FROM Payment p
    JOIN Booking b ON p.booking_id = b.booking_id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).send({ message: 'Error fetching payments', error: err });
    }
    res.json(results);
  });
});

// Add a new payment
app.post('/api/payments', (req, res) => {
  const { booking_id, payment_date, amount, payment_method } = req.body;

  if (!booking_id || !payment_date || !amount || !payment_method) {
    return res.status(400).send({ message: 'Please provide all payment details' });
  }

  const query = `
    INSERT INTO Payment (booking_id, payment_date, amount, payment_method)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [booking_id, payment_date, amount, payment_method], (err, results) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).send({ message: 'Error adding payment', error: err });
    }

    res.status(201).send({
      payment_id: results.insertId,
      booking_id,
      payment_date,
      amount,
      payment_method
    });
  });
});

// Delete a payment
app.delete('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Payment WHERE payment_id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting payment:', err);
      return res.status(500).send({ message: 'Error deleting payment', error: err });
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});

// Update a payment
app.put('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  const { booking_id, payment_date, amount, payment_method } = req.body;

  if (!booking_id || !payment_date || !amount || !payment_method) {
    return res.status(400).send({ message: 'Please provide all payment details' });
  }

  const query = `
    UPDATE Payment
    SET booking_id = ?, payment_date = ?, amount = ?, payment_method = ?
    WHERE payment_id = ?
  `;
  connection.query(query, [booking_id, payment_date, amount, payment_method, id], (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).send({ message: 'Error updating payment', error: err });
    }
    res.json({ message: 'Payment updated successfully' });
  });
});


// Get all attendees related to bookings
app.get('/api/attendees', (req, res) => {
  const query = 'SELECT * FROM Attendee';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching attendees:', err);
      return res.status(500).send({ message: 'Error fetching attendees', error: err });
    }
    res.json(results);
  });
});

// Add a new attendee
app.post('/api/attendees', (req, res) => {
  const { name, contact, email, age, address } = req.body;
  
  if (!name || !contact || !email || !age || !address) {
    return res.status(400).send({ message: 'Please provide all attendee details' });
  }

  const query = 'INSERT INTO Attendee (name, contact, email, age, address) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, contact, email, age, address], (err, results) => {
    if (err) {
      console.error('Error adding attendee:', err);
      return res.status(500).send({ message: 'Error adding attendee', error: err });
    }
    
    res.status(201).send({
      attendee_id: results.insertId,
      name,
      contact,
      email,
      age,
      address
    });
  });
});

// Delete an attendee
app.delete('/api/attendees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Attendee WHERE attendee_id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting attendee:', err);
      return res.status(500).send({ message: 'Error deleting attendee', error: err });
    }
    res.json({ message: 'Attendee deleted successfully' });
  });
});

// Update an attendee
app.put('/api/attendees/:id', (req, res) => {
  const { id } = req.params;
  const { name, contact, email, age, address } = req.body;

  if (!name || !contact || !email || !age || !address) {
    return res.status(400).send({ message: 'Please provide all attendee details' });
  }

  const query = 'UPDATE Attendee SET name = ?, contact = ?, email = ?, age = ?, address = ? WHERE attendee_id = ?';
  connection.query(query, [name, contact, email, age, address, id], (err, result) => {
    if (err) {
      console.error('Error updating attendee:', err);
      return res.status(500).send({ message: 'Error updating attendee', error: err });
    }
    res.json({ message: 'Attendee updated successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
