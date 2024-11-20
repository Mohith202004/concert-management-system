-- Create the database
CREATE DATABASE IF NOT EXISTS concert_management;
USE concert_management;

-- Concert Table
CREATE TABLE IF NOT EXISTS Concert (
    concert_id INT AUTO_INCREMENT PRIMARY KEY,
    concert_name VARCHAR(100) NOT NULL,
    concert_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL,
    description TEXT
);

-- Venue Table
CREATE TABLE IF NOT EXISTS Venue (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(100),
    address TEXT,
    contact_info VARCHAR(100)
);

-- Artist Table
CREATE TABLE IF NOT EXISTS Artist (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(100) NOT NULL,
    social_media VARCHAR(100),
    genre VARCHAR(50)
);

-- Organizer Table
CREATE TABLE IF NOT EXISTS Organizer (
    organizer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100),
    email VARCHAR(100)
);

-- Ticket Table
CREATE TABLE IF NOT EXISTS Ticket (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    concert_id INT,
    ticket_type ENUM('Regular', 'VIP', 'VVIP') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status ENUM('Available', 'Sold Out') DEFAULT 'Available',
    FOREIGN KEY (concert_id) REFERENCES Concert(concert_id)
);

-- Attendee Table
CREATE TABLE IF NOT EXISTS Attendee (
    attendee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    email VARCHAR(100),
    age INT,
    address TEXT
);

-- Booking Table
CREATE TABLE IF NOT EXISTS Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    attendee_id INT,
    ticket_id INT,
    booking_date DATE NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (attendee_id) REFERENCES Attendee(attendee_id),
    FOREIGN KEY (ticket_id) REFERENCES Ticket(ticket_id)
);

-- Payment Table
CREATE TABLE IF NOT EXISTS Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Credit Card', 'Debit Card', 'Cash', 'Online Payment') NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

-- Sponsorship Table
CREATE TABLE IF NOT EXISTS Sponsorship (
    sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_name VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    concert_id INT,
    FOREIGN KEY (concert_id) REFERENCES Concert(concert_id)
);

-- Sample data for testing (optional)
INSERT INTO Concert (concert_name, concert_date, start_time, end_time, status, description)
VALUES 
('Rock Concert 2024', '2024-07-14', '18:30:00', '22:00:00', 'Scheduled', 'An epic rock concert featuring famous bands.');

INSERT INTO Venue (name, capacity, location, address, contact_info)
VALUES 
('Madison Square Garden', 20000, 'New York', '123 7th Ave, New York, NY 10001', 'contact@msg.com');

INSERT INTO Artist (artist_name, social_media, genre)
VALUES 
('The Rockers', '@therockersband', 'Rock');

INSERT INTO Organizer (name, contact_info, email)
VALUES 
('EventPro Ltd.', '123-456-7890', 'info@eventpro.com');

INSERT INTO Ticket (concert_id, ticket_type, price, availability_status)
VALUES 
(1, 'Regular', 50.00, 'Available'),
(1, 'VIP', 100.00, 'Available'),
(1, 'VVIP', 150.00, 'Available');

INSERT INTO Attendee (name, contact, email, age, address)
VALUES 
('John Doe', '555-123-4567', 'johndoe@example.com', 30, '456 Main St, New York, NY');

INSERT INTO Booking (attendee_id, ticket_id, booking_date, status)
VALUES 
(1, 1, '2024-07-01', 'Confirmed');

INSERT INTO Payment (booking_id, payment_date, amount, payment_method)
VALUES 
(1, '2024-07-02', 50.00, 'Credit Card');

INSERT INTO Sponsorship (sponsor_name, contact, concert_id)
VALUES 
('BrandX Co.', 'sponsor@brandx.com', 1);
ALTER TABLE Concert
MODIFY COLUMN status VARCHAR(50);
UPDATE Concert
SET status = 'Upcoming'
WHERE status = 'Scheduled';

UPDATE Concert
SET status = 'Completed'
WHERE status = 'Cancelled';
ALTER TABLE Concert
MODIFY COLUMN status ENUM('Upcoming', 'Ongoing', 'Completed') NOT NULL;
UPDATE Concert
SET status = 'Ongoing'
WHERE concert_name = 'Rock Concert 2024';


