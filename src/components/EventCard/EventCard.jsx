import React from 'react';
import useTimezoneConversion from '../../hooks/useTimezoneConversion';
import './EventCard.css';

export default function EventCard({ event, viewerTz, onEdit, onViewHistory }) {
  const start = useTimezoneConversion(event.startAt, viewerTz);
  const end = useTimezoneConversion(event.endAt, viewerTz, 'hh:mm A');
  const createdAt = useTimezoneConversion(event.createdAt, viewerTz, 'DD MMM YYYY, hh:mm A');
  const updatedAt = useTimezoneConversion(event.updatedAt, viewerTz, 'DD MMM YYYY, hh:mm A');
  const wasUpdated = event.createdAt !== event.updatedAt;

  const userList = event.users || [];

  return (
    <div className="event-card">
      <div className="event-card-main">
        <h3 className="event-card-title">{event.title || 'Untitled Event'}</h3>
        {event.description && <p className="event-card-desc">{event.description}</p>}

        <div className="event-card-time">
          {start} – {end} <span className="event-card-tz">({viewerTz})</span>
        </div>

        {/* User Badges / Profiles */}
        <div className="event-card-profiles">
          {userList.map((user) => {
            // Handle populated user object vs raw string ID
            const userId = typeof user === 'string' ? user : user._id;
            const userName = typeof user === 'string' ? user : user.name;

            return (
              <span key={userId} className="profile-pill">
                {userName}
              </span>
            );
          })}
        </div>

        <div className="event-card-meta">
          <span>Created {createdAt}</span>
          {wasUpdated && <span> · Updated {updatedAt}</span>}
        </div>
      </div>

      <div className="event-card-actions">
        <button type="button" className="btn btn-secondary" onClick={() => onEdit(event)}>
          Update
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onViewHistory(event)}>
          History
        </button>
      </div>
    </div>
  );
}