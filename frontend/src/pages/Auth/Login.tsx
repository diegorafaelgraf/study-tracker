import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { login } from '../../services/auth.service';

import { useAuth } from '../../context/auth.context.tsx';

import styles from './Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: saveToken } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ username, password });
      saveToken(data.access_token);
      navigate('/');
    } catch {
      setError(t('auth.invalid-credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t('common.study-tracker')}</h1>
          <p className={styles.subtitle}>{t('auth.log-in-to-continue')}</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="username">{t('auth.user')}</label>
              <input
                id="username"
                type="text"
                placeholder={t('auth.enter-user')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">{t('auth.pass')}</label>
              <input
                id="password"
                type="password"
                placeholder={t('auth.enter-pass')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? t('auth.logging-in') : t('auth.log-in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}