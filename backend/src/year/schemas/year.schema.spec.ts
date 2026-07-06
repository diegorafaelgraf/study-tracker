import { YearSchema } from './year.schema';

describe('YearSchema', () => {
  it('defines a unique index for year and userId', () => {
    const indexes = YearSchema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          { year: 1, userId: 1 },
          expect.objectContaining({ unique: true }),
        ],
      ]),
    );
  });

  it('defines a partial unique index for open years per user', () => {
    const indexes = YearSchema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          { userId: 1, closed: 1 },
          expect.objectContaining({
            unique: true,
            partialFilterExpression: { closed: false },
          }),
        ],
      ]),
    );
  });
});
