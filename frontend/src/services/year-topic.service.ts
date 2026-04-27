import api from './api';

export const addTopicToYear = async (topicData: { topicId: string; goalMinutes: number }) => {
  const { data } = await api.post('/api/year-topic', topicData);
  return data;
};

export const getYearTopics = async (yearId: string) => {
  const { data } = await api.get(`/api/year-topic/${yearId}`);
  return data;
};