import { PracticeSchema } from './practice.schema';

describe('PracticeSchema', () => {
  it('defines required fields and default values', () => {
    const yearTopicIdPath = PracticeSchema.path('yearTopicId');
    const userIdPath = PracticeSchema.path('userId');
    const durationMinutesPath = PracticeSchema.path('durationMinutes');

    expect(yearTopicIdPath.options.required).toBe(true);
    expect(userIdPath.options.required).toBe(true);
    expect(durationMinutesPath.options.default).toBe(0);
  });
});
