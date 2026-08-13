import React, { useState } from 'react';
import TimezoneSelect from './TimezoneSelect/TimezoneSelect';
import EventList from './EventList/EventList';

export default function EventsViewCard() {
  const [viewTimezone, setViewTimezone] = useState('America/New_York');

  return (
    <div className="card events-view-card">
      <h3>Events</h3>
      <div className="form-group">
        <label>View in Timezone</label>
        <TimezoneSelect value={viewTimezone} onChange={setViewTimezone} />
      </div>

      <EventList viewerTimezone={viewTimezone} />
    </div>
  );
}