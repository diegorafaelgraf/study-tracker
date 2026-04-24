import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import Header from './Header/Header';
import type { JSX } from 'react';

export default function AdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" />;

  const payload = JSON.parse(atob(token.split('.')[1]));

  if (payload.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}