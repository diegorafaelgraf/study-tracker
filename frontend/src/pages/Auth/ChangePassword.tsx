import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PageContainer from '../../components/ui/PageContainer/PageContainer';
import styles from './ChangePassword.module.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (oldPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    try {
      setLoading(true);
      await api.post('/users/change-password', {
        oldPassword,
        newPassword,
      });
      setSuccess('Contraseña cambiada exitosamente');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>Cambiar Contraseña</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Contraseña Actual</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Contraseña Nueva</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              placeholder="Ingresa la nueva contraseña"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="Confirma la nueva contraseña"
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
