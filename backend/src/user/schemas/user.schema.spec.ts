import { UserSchema } from './user.schema';

describe('UserSchema', () => {
  it('defines a unique required username', () => {
    const usernamePath = UserSchema.path('username');

    expect(usernamePath.options.required).toBe(true);
    expect(usernamePath.options.unique).toBe(true);
  });

  it('sets default role to USER and enforces enum values', () => {
    const rolePath = UserSchema.path('role');

    expect(rolePath.options.default).toBe('USER');
    expect(rolePath.options.enum).toEqual(expect.objectContaining({
      ADMIN: 'ADMIN',
      USER: 'USER',
    }));
  });
});
