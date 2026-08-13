import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadEvents } from '../../store/slices/eventSlice';
import EventCard from '../EventCard/EventCard';
import EditEventModal from '../EditEventModal/EditEventModal';
import EventLogModal from '../EventLogs/EventLogModal';
import Loader from '../common/Loader';
import { formatInTimezone } from '../../utils/timezone';
import './EventList.css';

function groupByDay(events, tz) {
  const buckets = new Map();
  for (const event of events) {
    const dayKey = formatInTimezone(event.startAt, tz, 'YYYY-MM-DD');
    if (!buckets.has(dayKey)) buckets.set(dayKey, []);
    buckets.get(dayKey).push(event);
  }
  return buckets;
}

export default function EventList({ viewerTimezone }) {
  const dispatch = useDispatch();
  
  // 1. Redux Store Selectors (using 'users' to match store configuration)
  const users = useSelector((state) => state.users?.items || []);
  const activeUserId = useSelector(
    (state) => state.session?.activeUserId || state.session?.activeProfileId
  );
  const activeUser = users.find((p) => p._id === activeUserId);

  // Use passed timezone prop, fallback to active user's timezone, or UTC
  const viewerTz = viewerTimezone || activeUser?.timezone || 'UTC';

  const { items: events = [], status } = useSelector((state) => state.events || {});

  const [editingEvent, setEditingEvent] = useState(null);
  const [historyEvent, setHistoryEvent] = useState(null);

  // 3. Load Events when Active User Changes
  useEffect(() => {
    if (activeUserId) {
      dispatch(loadEvents(activeUserId));
    }
  }, [dispatch, activeUserId]);

  // 4. Filter events for current active user
  const userEvents = useMemo(() => {
    if (!activeUserId) return [];
    return events.filter((event) => {
      if (!event.users || event.users.length === 0) return false;
      return event.users.some((u) => {
        const id = typeof u === 'string' ? u : u._id;
        return id === activeUserId;
      });
    });
  }, [events, activeUserId]);

  // 5. Group Filtered Events by Day
  const grouped = useMemo(() => groupByDay(userEvents, viewerTz), [userEvents, viewerTz]);

  return (
    <section className="event-list-section">
      {status === 'loading' && <Loader label="Loading events…" />}

      {status !== 'loading' && userEvents.length === 0 && (
        <div className="event-list-empty-container">
          <p className="event-list-empty">No events found</p>
        </div>
      )}

      {Array.from(grouped.entries()).map(([day, dayEvents]) => (
        <div key={day} className="event-day-group">
          <h4 className="event-day-heading">
            {formatInTimezone(dayEvents[0].startAt, viewerTz, 'dddd, DD MMM YYYY')}
          </h4>
          <div className="event-day-items">
            {dayEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                viewerTz={viewerTz}
                onEdit={setEditingEvent}
                onViewHistory={setHistoryEvent}
              />
            ))}
          </div>
        </div>
      ))}

        {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {historyEvent && (
        <EventLogModal event={historyEvent} onClose={() => setHistoryEvent(null)} />
      )}
    </section>
  );
}