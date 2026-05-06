import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BackButton.module.css';

type BackButtonProps = {
  className?: string;
};

type RouteRule = {
  match: (path: string, segments: string[]) => boolean;
  resolve: (path: string, segments: string[]) => string;
};

export default function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const rules: RouteRule[] = [
    {
      match: (path, segments) =>
        path.startsWith('/closed-years/') && segments.length > 1,
      resolve: () => '/closed-years',
    },
    {
      match: (path, segments) =>
        path.startsWith('/current-year/') && segments.length === 3,
      resolve: (_, segments) => {
        const yearId = segments[1];
        return `/current-year/${yearId}`;
      },
    },
    {
      match: (path, segments) =>
        path.startsWith('/current-year/') && segments.length == 2,
      resolve: () => '/',
    },
    {
      match: (path) =>
        path.startsWith('/years/') && path.includes('/add-topic'),
      resolve: (_, segments) => {
        const yearId = segments[1];
        return `/current-year/${yearId}`;
      },
    },
    {
      match: (path, segments) =>
        path.startsWith('/topics/') &&
        segments.length > 1 &&
        !path.includes('/create'),
      resolve: () => '/topics',
    },
    {
      match: (path) =>
        [
          '/topics/create',
          '/practices/new',
          '/years',
          '/change-password',
          '/admin/users',
        ].includes(path),
      resolve: (path) => {
        if (path === '/topics/create') return '/topics';
        return '/';
      },
    },
  ];

  const getParentRoute = (currentPath: string): string => {
    const segments = currentPath.split('/').filter(Boolean);
    const rule = rules.find((r) => r.match(currentPath, segments));
    return rule ? rule.resolve(currentPath, segments) : '/';    
  };

  const handleBack = () => {
    const parentRoute = getParentRoute(location.pathname);
    navigate(parentRoute);
  };

  return (
    <button
      className={`${styles.backButton} ${className || ''}`}
      onClick={handleBack}
      title="Volver al nivel superior"
    >
      ← Volver
    </button>
  );
}