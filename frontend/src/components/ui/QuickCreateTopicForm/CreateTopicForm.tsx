import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { createTopic } from '../../../services/topic.service';

import { useAuth } from '../../../context/auth.context';

import { topicIcons } from '../../../constants/topicIcons';

import styles from './CreateTopicForm.module.css';

interface CreateTopicFormProps {
  onSuccess: () => void;
}

export default function CreateTopicForm({ onSuccess }: CreateTopicFormProps) {
  // Form state
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');
  const { userId } = useAuth();

  // Mutation
  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      toast.success('Área creada exitosamente ✅');
      queryClient.invalidateQueries({ queryKey: ['topics', userId] });
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error creando área');
    },
  });

  // Handlers
  const handleIconClick = (iconName: string) => {
    // If the clicked icon is already selected (to deselect), only allow if it's not the default icon
    if (selectedIcon === iconName) {
      // If it's the default icon, do nothing (can't deselect it)
      if (iconName !== 'BookOpen') {
        setSelectedIcon('BookOpen');
      }
    } else {
      // If it's a different icon, select that one
      setSelectedIcon(iconName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('El nombre del área es requerido');
      return;
    }

    if (name.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    mutation.mutate({
      name: name.trim(), icon: selectedIcon
    });
  };

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nueva Área</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre del Área</label>
          <input
            id="name"
            type="text"
            placeholder="Ej: Piano, Guitarra, Matemáticas, Inglés..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
          <small className={styles.hint}>
            Ingresa el nombre de la actividad o materia que quieres trackear
          </small>
        </div>

        <div className={styles.iconGrid}>
          {topicIcons.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleIconClick(name)}
              className={
                selectedIcon === name
                  ? styles.selectedIconButton
                  : styles.iconButton
              }
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            disabled={mutation.isPending}
            className={styles.submitBtn}
          >
            {mutation.isPending ? 'Creando...' : 'Crear Área'}
          </button>

          <button
            type="button"
            onClick={onSuccess}
            disabled={mutation.isPending}
            className={styles.cancelBtn}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}