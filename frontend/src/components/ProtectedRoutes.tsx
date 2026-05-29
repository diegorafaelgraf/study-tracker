import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import Header from './Header/Header';
import type { JSX } from 'react';


export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header role={role} />
      {children}
    </>
  );
}