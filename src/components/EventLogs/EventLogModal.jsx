import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadEventLogs } from '../../store/slices/eventSlice';
import Modal from '../common/Modal';
import { formatInTimezone } from '../../utils/timezone';
import './EventLogs.css';

const FIELD_LABELS = {
  title: 'Title',
  description: 'Description',
  users: 'Assigned Users',
  timezone: 'Timezone',
  startAt: 'Start',
  endAt: 'End',
};

function renderValue(field, value, tz, profileNameById) {
  if (value === undefined || value === null || value === '') return '—';
  if (field === 'startAt' || field === 'endAt') {
    return formatInTimezone(value, tz, 'DD MMM YYYY, hh:mm A');
  }
  if (field === 'users') {
    const ids = Array.isArray(value) ? value : [value];
    return ids.map((id) => profileNameById[id] || id).join(', ');
  }
  return String(value);
}

export default function EventLogModal({ event, viewerTz: propViewerTz, onClose }) {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.events?.logsByEventId?.[event?._id]) || [];
  const logsStatus = useSelector((state) => state.events?.logsStatus);
  const users = useSelector((state) => state.users?.items || []);
  const activeProfileId = useSelector((state) => state.session?.activeUserId);

  const activeProfile = users.find((p) => p?._id === activeProfileId);
  const viewerTz = propViewerTz || activeProfile?.timezone || 'UTC';

  const profileNameById = users.reduce((acc, p) => {
    acc[p?._id] = p.name;
    return acc;
  }, {});

  useEffect(() => {
    dispatch(loadEventLogs(event._id));
  }, [dispatch, event._id]);

  return (
    <Modal title={`Update History — ${event.title}`} onClose={onClose} width="600px">
      {logsStatus === 'loading' && logs.length === 0 && <p className="logs-empty">Loading history…</p>}
      {logsStatus !== 'loading' && logs.length === 0 && (
        <p className="logs-empty">No updates have been made to this event yet.</p>
      )}

      <div className="log-list">
        {logs.map((log) => (
          <div key={log._id} className="log-entry">
            <div className="log-entry-time">
              {formatInTimezone(log.createdAt, viewerTz, 'DD MMM YYYY, hh:mm A')} ({viewerTz})
            </div>
            <ul className="log-changes">
              {log.changes.map((c, i) => (
                <li key={i}>
                  <strong>{FIELD_LABELS[c.field] || c.field}:</strong>{' '}
                  <span className="log-old">
                    {renderValue(c.field, c.oldValue, viewerTz, profileNameById)}
                  </span>{' '}
                  {'--->  '}
                  <span className="log-new">
                    {renderValue(c.field, c.newValue, viewerTz, profileNameById)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  );
}
