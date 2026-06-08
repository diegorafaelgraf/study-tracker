import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import { changePassword } from '../../../services/user.service';

import styles from './ChangePasswordForm.module.css';

interface ChangePasswordFormProps {
  title?: string;
  onSuccess?: () => void;
}

export default function ChangePasswordForm({ title, onSuccess }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(t('change-pass.pass-changed'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t('change-pass.changed-pass-error'));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t('change-pass.pass-do-not-match'));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('change-pass.pass-long-error'));
      return;
    }
    await mutation.mutateAsync({ oldPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {title && <h1>{title}</h1>}
      <div className={styles.formGroup}>
        <label htmlFor="oldPassword">{t('change-pass.current-pass')}</label>
        <input
          id="oldPassword"
          type="password"
          placeholder=""
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="newPassword">{t('change-pass.new-pass')}</label>
        <input
          id="newPassword"
          type="password"
          placeholder={t('change-pass.enter-current-pass')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">{t('change-pass.new-pass-confirm')}</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder={t('change-pass.new-pass-confirmation')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        {t('change-pass.change-pass')}
      </button>

      <button type="button" className={styles.cancelBtn} onClick={() => onSuccess?.()}>
        {t('change-pass.cancel')}
      </button>
    </form>
  );
}