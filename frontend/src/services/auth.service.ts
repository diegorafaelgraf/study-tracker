import api from './api';

export const login = async (payload: {
  username: string;
  password: string;
}) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};