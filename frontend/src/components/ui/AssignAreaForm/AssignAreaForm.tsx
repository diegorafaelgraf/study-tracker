import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import { toast } from 'sonner';

import type { Topic } from '../../../types/Topic';

import { getTopics, getTopicsCurrentYear } from '../../../services/topic.service';
import { addTopicToYear } from '../../../services/year-topic.service';

import { useAuth } from '../../../context/auth.context';

import styles from './AssignAreaForm.module.css';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

interface AssignAreaFormProps {
  onCreateNewTopic: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignAreaForm({ onCreateNewTopic, onClose, onSuccess }: AssignAreaFormProps) {
  // Form state
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [goalMinutes, setGoalMinutes] = useState('');

  // Queries
  // Obtenning all areas of the user to show in the dropdown
  const { data: allTopics, isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });
  // Obtenning the areas that are already in the year to filter them out from the dropdown
  const { data: yearTopics, isLoading: loadingYearTopics } = useQuery({
    queryKey: ['topics-by-year', userId],
    queryFn: () => getTopicsCurrentYear(),
  });

  // Filtering out the areas that are already in the year from the dropdown options
  const availableTopics = allTopics?.filter((topic: Topic) =>
    !yearTopics?.some((yearTopic: Topic) => yearTopic._id === topic._id)
  ) || [];

  // Mutation
  const mutation = useMutation({
    mutationFn: addTopicToYear,
    onSuccess: () => {
      toast.success('Área asignada exitosamente ✅');
      queryClient.invalidateQueries({ queryKey: ['topics-current-year', userId] });
      queryClient.invalidateQueries({ queryKey: ['topics-by-year', userId] });
      onSuccess();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Error agregando área al año');
    },
  });

  // Handlers
  const handleCrearTopicClick = () => {
    onCreateNewTopic();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId) {
      toast.error('Debes seleccionar un área');
      return;
    }

    const minutes = parseInt(goalMinutes);
    if (!goalMinutes || minutes <= 0) {
      toast.error('Los minutos objetivo deben ser un número mayor a 0');
      return;
    }

    mutation.mutate({
      topicId: selectedTopicId,
      goalMinutes: minutes,
    })
  };

  // Loading state
  const isLoading = loadingTopics || loadingYearTopics;
  const hasNoTopics = availableTopics.length === 0;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Asignar Área al Año</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="topic">Seleccionar Área</label>
          <select
            id="topic"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            required
            disabled={hasNoTopics}
            className={styles.select}
          >
            <option value="">-- Seleccionar área --</option>
            {availableTopics.map((topic: Topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>
          {hasNoTopics ? (
            <div className={styles.emptyState}>
              <p>Todavía no tenés tópicos creados.</p>
              <button
                type="button"
                onClick={handleCrearTopicClick}
                className={styles.linkBtn}
              >
                Crear tópico
              </button>
            </div>
          ) : (
            <small className={styles.hint}>
              Cantidad total de minutos que planeas dedicar a esta área durante el año
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="goalMinutes">Minutos Objetivo por Año</label>
          <input
            id="goalMinutes"
            type="number"
            placeholder="Ej: 1000"
            value={goalMinutes}
            onChange={(e) => setGoalMinutes(e.target.value)}
            min="1"
            required
            className={styles.input}
          />
          <small className={styles.hint}>
            Cantidad total de minutos que planeas dedicar a esta área durante el año
          </small>
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            disabled={mutation.isPending || hasNoTopics}
            className={styles.submitBtn}
          >
            {mutation.isPending ? 'Agregando...' : 'Agregar Área'}
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}