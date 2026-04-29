import api from './api';

export const getYears = async () => {
  const { data } = await api.get('/api/years');
  return data;
};

export const getClosedYears = async () => {
  const { data } = await api.get('/api/years/closed');
  return data;
};

export const getCurrentYear = async () => {
  const { data } = await api.get('/api/years/opened');
  return data;
};

export const getYearsByTopic = async (topicId: string) => {
  const { data } = await api.get(`/api/years/by-topic/${topicId}`);
  return data;
};

export const createYear = async (payload: {
  year: string;
}) => {
  const { data } = await api.post('/api/years', payload);
  return data;
};

export const closeYear = async (yearId: string) => {
  const { data } = await api.patch(`/api/years/${yearId}/close`);
  return data;
};