import api from './api';

export const createUser = async (payload: {
  username: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}) => {
  const { data } = await api.post('/api/users', payload);
  return data;
};