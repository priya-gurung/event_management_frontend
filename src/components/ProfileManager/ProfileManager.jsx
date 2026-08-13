import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../store/slices/userSlice';
import Modal from '../common/Modal';
import './ProfileManager.css';

export default function ProfileManager({ onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.items || []);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await dispatch(addUser({ name: name.trim() })).unwrap();
      setName('');
    } catch (err) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Manage Users" onClose={onClose}>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          <span>New user name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            autoFocus
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Profile'}
        </button>
      </form>

      <div className="profile-list">
        <h4>Existing Users ({users.length})</h4>
        <ul>
          {users.map((p) => (
            <li key={p._id}>
              <span>{p.name}</span>
              <span className="profile-list-tz">{p.timezone}</span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
