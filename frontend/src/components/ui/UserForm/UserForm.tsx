import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

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

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuario creado exitosamente ✅');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('USER');
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error creando usuario ❌');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    await mutation.mutateAsync({ username, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {title && <h1>{title}</h1>}
      <div className={styles.formGroup}>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Ingresa un nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Ingresa la contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirma la contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Crear Usuario
      </button>

      <button type="button" className={styles.cancelBtn} onClick={() => onSuccess?.()}>
        Cancelar
      </button>
    </form>
  );
}