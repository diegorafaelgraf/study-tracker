import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import { createUser } from '../../../services/user.service';

import styles from './UserForm.module.css';

interface UserFormProps {
  title?: string;
  onSuccess?: () => void;
}

export default function UserForm({ title, onSuccess }: UserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success(t('user-form.user-created-successfully'));
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('USER');
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t('user-form.create-user-error'));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error(t('user-form.all-fields-required'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('user-form.passwords-do-not-match'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('user-form.password-min-length'));
      return;
    }

    await mutation.mutateAsync({ username, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {title && <h1>{title}</h1>}
      <div className={styles.formGroup}>
        <label htmlFor="username">{t('user-form.username')}</label>
        <input
          id="username"
          type="text"
          placeholder={t('user-form.username-placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">{t('user-form.password')}</label>
        <input
          id="password"
          type="password"
          placeholder={t('user-form.password-placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">{t('user-form.confirm-password')}</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder={t('user-form.confirm-password-placeholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        {t('user-form.create-user')}
      </button>

      <button type="button" className={styles.cancelBtn} onClick={() => onSuccess?.()}>
        {t('user-form.cancel')}
      </button>
    </form>
  );
}