import apiClient from './apiClient';

export const fetchUsers = () => {
  return apiClient('/user');
};

export const createUsers = (payload) => {
  const body = typeof payload === 'string' ? { name: payload } : payload;
  return apiClient('/user', {
    method: 'POST',
    body,
  });
};

export const updateTimezone = (profileId, timezone) => {
  return apiClient(`/user/${profileId}/timezone`, {
    method: 'PATCH',
    body: { timezone },
  });
};