import api from './api';

export const createPractice = async (payload: {
  yearTopicId: string;
  durationMinutes: number;
  date: string;
}) => {
  const { data } = await api.post('/api/practice', payload);
  return data;
};