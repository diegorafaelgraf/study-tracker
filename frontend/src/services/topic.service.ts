import api from './api';

export const getTopics = async () => {
  const { data } = await api.get('/api/topics');
  return data;
};

export const getTopicsByYear = async (yearId: string) => {
  const { data } = await api.get(`/api/topics/year/${yearId}`);
  return data;
};