import { YearTopicSchema } from './year-topic.schema';

describe('YearTopicSchema', () => {
  it('defines a unique index for topicId and yearId', () => {
    const indexes = YearTopicSchema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          { topicId: 1, yearId: 1 },
          expect.objectContaining({ unique: true }),
        ],
      ]),
    );
  });
});
