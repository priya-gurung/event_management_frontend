import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEventThunk } from '../../store/slices/eventSlice';
import Modal from '../common/Modal';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import TimezoneSelect from '../TimezoneSelect/TimezoneSelect';
import { toUtcISOString, fromUtcToLocalParts } from '../../utils/timezone';

export default function EditEventModal({ event, onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.items || []);

  const [form, setForm] = useState({
    profileIds: [],
    timezone: 'UTC',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      const start = fromUtcToLocalParts(event.startAt, event.timezone);
      const end = fromUtcToLocalParts(event.endAt, event.timezone);

      const userIds = (event.users || event.profiles || []).map((u) =>
        typeof u === 'string' ? u : u._id
      );

      setForm({
        profileIds: userIds,
        timezone: event.timezone || 'UTC',
        startDate: start.dateStr,
        startTime: start.timeStr,
        endDate: end.dateStr,
        endTime: end.timeStr,
      });
    }
  }, [event]);

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

    if (form.profileIds.length === 0) return setError('Select at least one profile');
    if (!form.startDate || !form.startTime) return setError('Start Date & Time required');
    if (!form.endDate || !form.endTime) return setError('End Date & Time required');

    const startAt = toUtcISOString(form.startDate, form.startTime, form.timezone);
    const endAt = toUtcISOString(form.endDate, form.endTime, form.timezone);

    setSubmitting(true);
    try {
      await dispatch(
        updateEventThunk({
          eventId: event._id,
          payload: {
            title: event.title || 'Event',
            users: form.profileIds,
            timezone: form.timezone,
            startAt,
            endAt,
          },
        })
      ).unwrap();

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Update Event" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label>Profiles</label>
          <ProfileDropdown
            users={users}
            isMulti={true}
            selectedIds={form.profileIds}
            placeholder="Select profiles..."
            onSelect={toggleProfile}
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
          {submitting ? 'Updating…' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}