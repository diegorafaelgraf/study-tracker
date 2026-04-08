// Add a new bank to the database
export type AddYearTopicInput = {
  yearId: string;
  topicId: string;
  goalMinutes: number;
  closed: boolean;
};