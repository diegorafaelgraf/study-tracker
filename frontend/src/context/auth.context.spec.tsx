import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth.context';

const createJwt = (payload: object): string =>
  ['header', btoa(JSON.stringify(payload)), 'signature'].join('.');

function AuthConsumer() {
  const { token, login, logout, userId, role } = useAuth();

  return (
    <div>
      <div data-testid="token">{token ?? 'null'}</div>
      <div data-testid="userId">{userId ?? 'undefined'}</div>
      <div data-testid="role">{role ?? 'undefined'}</div>
      <button onClick={() => login(createJwt({ sub: 'user123', exp: Math.floor(Date.now() / 1000) + 3600, role: 'ADMIN' }))}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads token from localStorage and exposes decoded claims', () => {
    const token = createJwt({ sub: 'user123', exp: Math.floor(Date.now() / 1000) + 3600, role: 'USER' });
    localStorage.setItem('token', token);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent(token);
    expect(screen.getByTestId('userId')).toHaveTextContent('user123');
    expect(screen.getByTestId('role')).toHaveTextContent('USER');
  });

  it('removes expired tokens during initialization', async () => {
    const expiredToken = createJwt({ sub: 'user123', exp: Math.floor(Date.now() / 1000) - 60, role: 'USER' });
    localStorage.setItem('token', expiredToken);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('token')).toHaveTextContent('null');
    });
  });

  it('supports login and logout actions', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('login'));

    const token = screen.getByTestId('token').textContent;
    expect(token).not.toBe('null');
    expect(localStorage.getItem('token')).toBe(token);

    await userEvent.click(screen.getByText('logout'));
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
