import api from './api';

export const createUser = async (payload: {
  username: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}) => {
  const { data } = await api.post('/api/users', payload);
  return data;
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const { data } = await api.post(`/api/users/change-password`, payload);
  return data;
};