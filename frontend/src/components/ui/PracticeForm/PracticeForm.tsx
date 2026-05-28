import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { getTopicsCurrentYear } from '../../../services/topic.service';
import { getCurrentYear } from '../../../services/year.service';
import { createPractice } from '../../../services/practice.service';

import { useAuth } from '../../../context/auth.context';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

import styles from './PracticeForm.module.css';

interface PracticeFormProps {
  onSuccess: () => void;
}

export default function PracticeForm({ onSuccess }: PracticeFormProps) {
  // Form state
  const [yearTopicId, setYearTopicId] = useState('');
  const [minutes, setMinutes] = useState('');
  const [date, setDate] = useState('');
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: topics, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['topics-current-year', userId],
    queryFn: getTopicsCurrentYear,
  });
  const { data: currentYear, isLoading: isCurrentYearLoading } = useQuery({
    queryKey: ['currentYear', userId],
    queryFn: getCurrentYear,
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: createPractice,
    onSuccess: () => {
      toast.success('Práctica registrada exitosamente ✅');
      queryClient.invalidateQueries({ queryKey: ['topics-current-year', userId] });
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error registrando práctica');
    }
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!yearTopicId || !minutes || !date) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    mutation.mutate({
      yearTopicId,
      durationMinutes: Number(minutes),
      date: new Date(date).toISOString()
    });
  };

  // Loading state
  const isLoading = isTopicsLoading || isCurrentYearLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrar Práctica</h1>
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre del Área</label>
          <select
            value={yearTopicId}
            onChange={(e) => setYearTopicId(e.target.value)}
            className={styles.input}
            disabled={mutation.isPending}
          >
            <option value="">Seleccionar área</option>
            {topics?.map((t: any) => (
              <option key={t.yearTopicId} value={t.yearTopicId}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Minutos practicados</label>
          <input
            type="number"
            placeholder="Minutos"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className={styles.input}
            disabled={mutation.isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Fecha de práctica</label>
          <input
            type="date"
            min={`${currentYear?.year}-01-01`}
            max={`${currentYear?.year}-12-31`}
            placeholder="Fecha"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
            disabled={mutation.isPending}
          />
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
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
    </div >
  );
}