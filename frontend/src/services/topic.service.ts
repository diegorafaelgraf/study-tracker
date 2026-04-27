import api from './api';

export const getTopics = async () => {
  const { data } = await api.get('/api/topics');
  return data;
};

export const getTopicsCurrentYear = async () => {
  const { data } = await api.get('/api/topics/by-current-year');
  return data;
};

export const getTopicsByYear = async (yearId: string) => {
  const { data } = await api.get(`/api/topics/by-year/${yearId}`);
  return data;
};

export const createTopic = async (topicData: { name: string }) => {
  const { data } = await api.post('/api/topics', topicData);
  return data;
};