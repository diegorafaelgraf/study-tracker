import api from './api';

export const getYears = async () => {
  const { data } = await api.get('/api/years');
  return data;
};

export const getClosedYears = async () => {
  const { data } = await api.get('/api/years/closed');
  return data;
};

export const getOpenedYears = async () => {
  const { data } = await api.get('/api/years/opened');
  return data;
};

export const getYearsByTopic = async (topicId: string) => {
  const { data } = await api.get(`/api/years/topics/${topicId}`);
  return data;
};