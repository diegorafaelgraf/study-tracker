import { YearSchema } from './schemas/year.schema';

describe('YearSchema indexes', () => {
  it('should include a unique index on year and userId', () => {
    const indexes = YearSchema.indexes();

    const found = indexes.some(([keys, options]) => {
      return (
        JSON.stringify(keys) === JSON.stringify({ year: 1, userId: 1 }) &&
        options?.unique === true
      );
    });

    expect(found).toBe(true);
  });

  it('should not create a global unique index on year alone', () => {
    const indexes = YearSchema.indexes();

    const found = indexes.some(([keys, options]) => {
      return (
        JSON.stringify(keys) === JSON.stringify({ year: 1 }) &&
        options?.unique === true
      );
    });

    expect(found).toBe(false);
  });

  it('should allow only one open year per user', () => {
    const indexes = YearSchema.indexes();

    const found = indexes.some(([keys, options]) => {
      return (
        JSON.stringify(keys) === JSON.stringify({ userId: 1, closed: 1 }) &&
        options?.unique === true &&
        options?.partialFilterExpression?.closed === false
      );
    });

    expect(found).toBe(true);
  });
});