import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { useState } from 'react';

import styles from './Header.module.css';

import Modal from '../../components/ui/Modal/Modal';
import ChangePasswordForm from '../../components/ui/ChangePasswordForm/ChangePasswordForm';

interface HeaderProps {
  role?: 'USER' | 'ADMIN';
}

export default function Header({ role = 'USER' }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.logo}>
            {role === 'USER' && (
              <button onClick={handleHome} className={styles.homeIconBtn} aria-label="Ir al inicio">
                <span className={styles.homeIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10L12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                </span>
              </button>
            )}
            Study Tracker
          </h1>
        </div>

        {role === 'USER' && (
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <button onClick={() => navigate('/years')} className={styles.navLink}>
                  Años
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/topics')} className={styles.navLink}>
                  Temas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/closed-years')} className={styles.navLink}>
                  Años Cerrados
                </button>
              </li>
            </ul>
          </nav>
        )}

        <div className={styles.rightSection}>

          <button onClick={() => openModal()} className={styles.changePasswordBtn}>
            Cambiar contraseña
          </button>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ChangePasswordForm title="Cambiar Contraseña" onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </header>
  );
}