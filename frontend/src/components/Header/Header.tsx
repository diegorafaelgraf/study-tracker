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

        <nav>
          // TODO: Add menu items here if needed, like links to other pages or user profile
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
