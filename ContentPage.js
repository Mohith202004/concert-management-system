// src/components/ContentPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import ConcertList from './ConcertList';
import VenueList from './VenueList';
import ArtistList from './ArtistList';
import OrganizerList from './OrganizerList';
import TicketList from './TicketList';
import AttendeeList from './AttendeeList';
import BookingList from './BookingList';
import PaymentDetails from './PaymentDetails';
import SponsorshipList from './SponsorshipList';

import '../App.css';

const ContentPage = () => {
  // Example data (replace with actual data from your API or database)
  const concerts = [
    { ConcertID: 1, Name: 'Rock Fest', Date: '2024-12-01', Status: 'Active', venueId: 1, artistId: 1, organizerId: 1, sponsorshipId: 1 }
  ];
  const venues = [
    { VenueID: 1, Name: 'Stadium', Location: 'City Center', Capacity: 5000 }
  ];
  const artists = [
    { ArtistID: 1, Name: 'The Rockers', Genre: 'Rock', ContactInfo: '123-456-789' }
  ];
  const organizers = [
    { OrganizerID: 1, Name: 'EventCo', ContactInfo: 'contact@eventco.com' }
  ];
  const tickets = [
    { TicketID: 1, Price: '$50', Type: 'VIP', AvailabilityStatus: 'Available', concertId: 1 }
  ];
  const attendees = [
    { AttendeeID: 1, Name: 'John Doe', ContactInfo: '123-456-7890', Email: 'john@example.com' }
  ];
  const bookings = [
    { BookingID: 1, TicketID: 1, AttendeeID: 1, BookingDate: '2024-11-01', PaymentStatus: 'Paid' }
  ];
  const payments = [
    { PaymentID: 1, Amount: 50, PaymentMethod: 'Credit Card', PaymentStatus: 'Completed', PaymentDate: '2024-11-01' }
  ];
  const sponsors = [
    { SponsorID: 1, SponsorName: 'SponsorCo', SponsorType: 'Music', ContactInfo: 'contact@sponsorco.com' }
  ];

  return (
    <div className="content-page">
      <div className="content-container">
        <h3 className="page-title"></h3>
        <div className="grid-container">
          
          {/* Section for Concerts */}
          <section className="grid-item">
            <h2>Concerts</h2>
            <ConcertList concerts={concerts} venues={venues} artists={artists} organizers={organizers} sponsorships={sponsors} tickets={tickets} />
          </section>

          {/* Section for Venues */}
          <section className="grid-item">
            <h2>Venues</h2>
            <VenueList venues={venues} />
          </section>

          {/* Section for Artists */}
          <section className="grid-item">
            <h2>Artists</h2>
            <ArtistList artists={artists} />
          </section>

          {/* Section for Organizers */}
          <section className="grid-item">
            <h2>Organizers</h2>
            <OrganizerList organizers={organizers} />
          </section>

          {/* Section for Tickets */}
          <section className="grid-item">
            <h2>Tickets</h2>
            <TicketList tickets={tickets} bookings={bookings} />
          </section>

          {/* Section for Attendees */}
          <section className="grid-item">
            <h2>Attendees</h2>
            <AttendeeList attendees={attendees} />
          </section>

          {/* Section for Bookings */}
          <section className="grid-item">
            <h2>Bookings</h2>
            <BookingList bookings={bookings} attendees={attendees} />
          </section>

          {/* Section for Payments */}
          <section className="grid-item">
            <h2>Payments</h2>
            <PaymentDetails payments={payments} />
          </section>

          {/* Section for Sponsorships */}
          <section className="grid-item">
            <h2>Sponsorships</h2>
            <SponsorshipList sponsors={sponsors} />
          </section>

        </div>

        {/* Back to Main Page Button */}
        <Link to="/" className="back-to-main-btn">Back to Main Page</Link>
      </div>
    </div>
  );
};

export default ContentPage;
