import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../store/slices/sessionSlice';
import ProfileDropdown from '../components/ProfileDropdown/ProfileDropdown';
import ProfileManager from '../components/ProfileManager/ProfileManager';
import CreateEventCard from '../components/CreateEventCard';
import EventsViewCard from '../components/EventsViewCard';
import './Dashboard.css';
import Header from '../components/Header';

export default function Dashboard() {
  const [showAddProfile, setShowAddProfile] = useState(false);

  return (
    <div className="dashboard-container">
      <Header/>

      <div className="dashboard-grid">
        <CreateEventCard onOpenAddProfile={() => setShowAddProfile(true)} />
        <EventsViewCard />
      </div>

      {showAddProfile && <ProfileManager onClose={() => setShowAddProfile(false)} />}
    </div>
  );
}