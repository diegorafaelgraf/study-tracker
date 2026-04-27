import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generar breadcrumbs desde la ruta
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);

    const breadcrumbs = [
      { label: 'Inicio', path: '/' }
    ];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.logo}>Practice and Study Tracker</h1>
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
