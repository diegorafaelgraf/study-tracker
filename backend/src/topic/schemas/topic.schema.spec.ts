import { TopicSchema } from './topic.schema';

describe('TopicSchema', () => {
  it('defines a unique index for normalized name and userId', () => {
    const indexes = TopicSchema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          { nameNormalized: 1, userId: 1 },
          expect.objectContaining({ unique: true }),
        ],
      ]),
    );
  });
});
