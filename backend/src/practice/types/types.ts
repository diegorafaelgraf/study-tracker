// Add a new practice to the database
export type AddPracticeInput = {
  yearTopicId: string;
  date: Date;
  durationMinutes: number;
};