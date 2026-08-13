import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers } from './store/slices/userSlice';
import { setActiveUser } from './store/slices/sessionSlice';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { items: users = [], status } = useSelector((state) => state.users || {});
  const activeUserId = useSelector((state) => state.session.activeUserId);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!activeUserId && users.length > 0) {
      dispatch(setActiveUser(users[0]._id));
    }
  }, [users, activeUserId, dispatch]);

  return (
    <div className="app-shell">
      <main className="app-main">
        {status === 'loading' && users.length === 0 ? (
          <p className="app-loading">Loading users…</p>
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

export default App;
