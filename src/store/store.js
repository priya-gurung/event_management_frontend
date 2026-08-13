import {configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import eventReducer from './slices/eventSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
    reducer: {
        users: userReducer,
        events: eventReducer,
        session: sessionReducer
    }
});

export default store;