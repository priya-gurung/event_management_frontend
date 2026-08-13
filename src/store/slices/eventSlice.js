import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as eventApi from '../../api/eventApi';

export const loadEvents = createAsyncThunk('events/load', async (profileId) => {
  return eventApi.fetchEvents(profileId);
});

export const createEventThunk = createAsyncThunk('events/create', async (payload) => {
  return eventApi.createEvent(payload);
});

export const updateEventThunk = createAsyncThunk(
  'events/update',
  async ({ eventId, payload }) => {
    return eventApi.updateEvent(eventId, payload);
  }
);

export const loadEventLogs = createAsyncThunk('events/loadLogs', async (eventId) => {
  const logs = await eventApi.fetchEventLogs(eventId);
  return { eventId, logs };
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    logsByEventId: {},
    logsStatus: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(loadEventLogs.pending, (state) => {
        state.logsStatus = 'loading';
      })
      .addCase(loadEventLogs.fulfilled, (state, action) => {
        state.logsStatus = 'succeeded';
        state.logsByEventId[action.payload.eventId] = action.payload.logs;
      });
  },
});

export default eventSlice.reducer;
