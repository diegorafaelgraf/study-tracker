import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/auth.context';
import { getYearById } from '../../services/year.service';
import { getTopicById } from '../../services/topic.service';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Extract IDs from URL
  const extractIds = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let yearId = '';
    let topicId = '';

    if (location.pathname.includes('/closed-years/') && pathSegments.length > 1) {
      yearId = pathSegments[1];
    } else if (location.pathname.includes('/current-year/') && pathSegments.length > 1) {
      yearId = pathSegments[1];
    } else if (location.pathname.includes('/years/') && pathSegments.length > 1 && location.pathname.includes('/add-topic')) {
      yearId = pathSegments[1];
    } else if (location.pathname.includes('/topics/') && pathSegments.length > 1 && !location.pathname.includes('/create')) {
      topicId = pathSegments[1];
    }

    return { yearId, topicId };
  };

  const { yearId, topicId } = extractIds();

  // Query year data if needed
  const { data: yearData } = useQuery({
    queryKey: ['year', yearId],
    queryFn: () => getYearById(yearId),
    enabled: !!yearId,
  });

  // Query topic data if needed
  const { data: topicData } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId,
  });

  // Generate breadcrumbs based on the current path
  const getBreadcrumbs = () => {
    const currentPath = location.pathname;

    // Mapeo de rutas a breadcrumbs amigables (sin IDs)
    const routeLabels: { [key: string]: { label: string; path: string }[] } = {
      '/': [{ label: 'Inicio', path: '/' }],
      '/closed-years': [
        { label: 'Inicio', path: '/' },
        { label: 'Años cerrados', path: '/closed-years' }
      ],      
      '/topics': [
        { label: 'Inicio', path: '/' },
        { label: 'Tópicos', path: '/topics' }
      ],
      '/topics/create': [
        { label: 'Inicio', path: '/' },
        { label: 'Tópicos', path: '/topics' },
        { label: 'Crear tópico', path: '/topics/create' }
      ],
      '/practices/new': [
        { label: 'Inicio', path: '/' },
        { label: 'Nueva práctica', path: '/practices/new' }
      ],
      '/years': [
        { label: 'Inicio', path: '/' },
        { label: 'Crear año', path: '/years' }
      ],
      '/change-password': [
        { label: 'Inicio', path: '/' },
        { label: 'Cambiar contraseña', path: '/change-password' }
      ],
      '/admin/users': [
        { label: 'Inicio', path: '/' },
        { label: 'Crear usuario', path: '/admin/users' }
      ]
    };

    // Look for the most specific route match in routeLabels
    const sortedRoutes = Object.keys(routeLabels).sort((a, b) => b.length - a.length);

    for (const route of sortedRoutes) {
      if (currentPath.startsWith(route)) {        
        // if it is an exact match, return the breadcrumb, otherwise continue checking for more specific routes
        if (route === currentPath) {
          return routeLabels[route];
        }
      }
    }

    // For add-topic routes, show the year name in the breadcrumb
    if (currentPath.includes('/add-topic')) {
      const yearName = yearData?.year || 'Año';
      return [
        { label: 'Inicio', path: '/' },
        { label: yearName, path: `/current-year/${yearId}` },
        { label: 'Agregar tópico', path: currentPath }
      ];
    }

    // For current-year routes, show the year name in the breadcrumb
    if (currentPath.includes('/current-year')) {
      const yearName = yearData?.year || 'Año';
      return [
        { label: 'Inicio', path: '/' },
        { label: yearName, path: currentPath }
      ];
    }

    // For closed-years routes, show the year name in the breadcrumb
    if (currentPath.includes('/closed-years/')) {
      const yearName = yearData?.year || 'Tópicos del año';
      return [
        { label: 'Inicio', path: '/' },
        { label: 'Años cerrados', path: '/closed-years' },
        { label: yearName, path: currentPath }
      ];
    }

    // For topic detail routes, show the topic name in the breadcrumb
    if (currentPath.includes('/topics/') && !currentPath.includes('/create')) {
      const topicName = topicData?.name || 'Años del tópico';
      return [
        { label: 'Inicio', path: '/' },
        { label: 'Tópicos', path: '/topics' },
        { label: topicName, path: currentPath }
      ];
    }

    // Fallback: basic breadcrumb with just "Inicio"
    return [{ label: 'Inicio', path: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.logo}>
            <button onClick={handleHome} className={styles.homeIconBtn} aria-label="Ir al inicio">
              <span className={styles.homeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10L12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </span>
            </button>
            Practice and Study Tracker
          </h1>
        </div>

        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              <a
                href={crumb.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(crumb.path);
                }}
                className={index === breadcrumbs.length - 1 ? styles.active : ''}
              >
                {crumb.label}
              </a>
              {index < breadcrumbs.length - 1 && <span className={styles.separator}> / </span>}
            </span>
          ))}
        </nav>

        <div className={styles.rightSection}>
          <button onClick={() => navigate('/change-password')} className={styles.changePasswordBtn}>
            Cambiar contraseña
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
