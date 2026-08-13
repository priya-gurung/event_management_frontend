import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../store/slices/sessionSlice';
import ProfileDropdown from './ProfileDropdown/ProfileDropdown'; 

const Header = ({ onAddProfile }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users?.items || []);
  const activeUserId = useSelector(
    (state) => state.session?.activeUserId || state.session?.activeProfileId
  );

  return (
    <header className="dashboard-header">
      <div>
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezones</p>
      </div>
      <div className="header-profile-select">
        <ProfileDropdown
          users={users}
          selectedId={activeUserId}
          placeholder="Select current profile..."
          onSelect={(id) => dispatch(setActiveUser(id))}
          onAddProfile={onAddProfile}
        />
      </div>
    </header>
  );
};

export default Header;