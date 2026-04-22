import api from './api';

export const createPractice = async (payload: {
  topicId: string;
  minutes: number;
  description?: string;
}) => {
  const { data } = await api.post('/practices', payload);
  return data;
};