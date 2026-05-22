import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

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

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Contraseña cambiada exitosamente ✅');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error cambiando contraseña ❌');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    await mutation.mutateAsync({ oldPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {title && <h1>{title}</h1>}
      <div className={styles.formGroup}>
        <label htmlFor="oldPassword">Contraseña Actual</label>
        <input
          id="oldPassword"
          type="password"
          placeholder="Ingresa tu contraseña actual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="newPassword">Nueva Contraseña</label>
        <input
          id="newPassword"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Cambiar Contraseña
      </button>

      <button type="button" className={styles.cancelBtn} onClick={() => onSuccess?.()}>
        Cancelar
      </button>
    </form>
  );
}