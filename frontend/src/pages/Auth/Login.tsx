import { useState } from 'react';
import { login } from '../../services/auth.service';
import { useAuth } from '../../context/auth.context.tsx';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: saveToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ username, password });
      saveToken(data.access_token);
      navigate('/');
    } catch {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Practice and Study Tracker</h1>
          <p className={styles.subtitle}>Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}