import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEventThunk } from '../store/slices/eventSlice';
import ProfileDropdown from './ProfileDropdown/ProfileDropdown';
import TimezoneSelect from './TimezoneSelect/TimezoneSelect';
import { toUtcISOString } from '../utils/timezone';

export default function CreateEventCard({ onOpenAddProfile }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.items || []);

  const [form, setForm] = useState({
    title: '',
    description: '',
    profileIds: [],
    timezone: 'America/New_York',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '09:00',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleProfile = (id) => {
    setForm((prev) => ({
      ...prev,
      profileIds: prev.profileIds.includes(id)
        ? prev.profileIds.filter((item) => item !== id)
        : [...prev.profileIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Event title is required');
    if (form.profileIds.length === 0) return setError('Select at least one profile');
    if (!form.startDate || !form.startTime) return setError('Start Date & Time required');
    if (!form.endDate || !form.endTime) return setError('End Date & Time required');

    const startAt = toUtcISOString(form.startDate, form.startTime, form.timezone);
    const endAt = toUtcISOString(form.endDate, form.endTime, form.timezone);

    if (new Date(endAt) <= new Date(startAt)) {
      return setError('End time must be after start time');
    }

    setSubmitting(true);
    try {
      await dispatch(
        createEventThunk({
          title: form.title.trim(),
          description: form.description.trim(),
          users: form.profileIds,
          timezone: form.timezone,
          startAt,
          endAt,
        })
      ).unwrap();

      setForm({
        title: '',
        description: '',
        profileIds: [],
        timezone: 'America/New_York',
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '09:00',
      });
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card create-event-card">
      <h3>Create Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Sprint Planning / Team Sync"
            maxLength={150}
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Add agenda or meeting details..."
            maxLength={1000}
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>Profiles</label>
          <ProfileDropdown
            users={users}
            isMulti={true}
            selectedIds={form.profileIds}
            placeholder="Select profiles..."
            onSelect={toggleProfile}
            onAddProfile={onOpenAddProfile}
          />
        </div>

        <div className="form-group">
          <label>Timezone</label>
          <TimezoneSelect
            value={form.timezone}
            onChange={(tz) => setForm({ ...form, timezone: tz })}
          />
        </div>

        <div className="form-group">
          <label>Start Date & Time</label>
          <div className="datetime-row">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>End Date & Time</label>
          <div className="datetime-row">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary-purple" disabled={submitting}>
          {submitting ? 'Creating…' : '+ Create Event'}
        </button>
      </form>
    </div>
  );
}