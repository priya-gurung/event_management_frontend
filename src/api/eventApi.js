import apiClient from './apiClient';

export const fetchEvents = (profileId) => {
  return apiClient('/events', {
    params: profileId ? { profileId } : {},
  });
};

export const fetchEventLogs = (eventId) => {
  return apiClient(`/events/${eventId}/logs`);
};

export const createEvent = (payload) => {
  return apiClient('/events', {
    method: 'POST',
    body: payload,
  });
};

export const updateEvent = (eventId, payload) => {
  return apiClient(`/events/${eventId}`, {
    method: 'PUT',
    body: payload,
  });
};