import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTopics, getTopicsByYear } from '../../services/topic.service';
import { addTopicToYear } from '../../services/year-topic.service';
import PageContainer from '../../components/ui/PageContainer/PageContainer';
import styles from './AddTopicToYear.module.css';
import { useAuth } from '../../context/auth.context';
import type { Topic } from '../../types/Topic';

export default function AddTopicToYear() {
  const navigate = useNavigate();
  const { yearId } = useParams();
  const queryClient = useQueryClient();
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [goalMinutes, setGoalMinutes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userId } = useAuth();

  // Obtenning all areas of the user to show in the dropdown
  const { data: allTopics, isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });

  // Obtenning the areas that are already in the year to filter them out from the dropdown
  const { data: yearTopics, isLoading: loadingYearTopics } = useQuery({
    queryKey: ['topics-by-year', yearId, userId],
    queryFn: () => getTopicsByYear(yearId!),
    enabled: !!yearId,
  });

  // Filtering out the areas that are already in the year from the dropdown options
  const availableTopics = allTopics?.filter((topic: Topic) =>
    !yearTopics?.some((yearTopic: Topic) => yearTopic._id === topic._id)
  ) || [];

  const mutation = useMutation({
    mutationFn: addTopicToYear,
    onSuccess: () => {
      setSuccess('Área agregada al año exitosamente ✅');
      queryClient.invalidateQueries({ queryKey: ['topics-by-year', yearId, userId] });
      setTimeout(() => {
        navigate(`/current-year/${yearId}`);
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error agregando área al año');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTopicId) {
      setError('Debes seleccionar un área');
      return;
    }

    const minutes = parseInt(goalMinutes);
    if (!goalMinutes || minutes <= 0) {
      setError('Los minutos objetivo deben ser un número mayor a 0');
      return;
    }

    try {
      await mutation.mutateAsync({
        topicId: selectedTopicId,
        goalMinutes: minutes,
      });
    } catch (err) {
      // Error handling is done in onError of the mutation
    }
  };

  if (loadingTopics || loadingYearTopics) {
    return (
      <PageContainer title="Cargando..." showBackButton={true}>
        <p>Cargando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Agregar Área al Año" showBackButton={true}>
      <div className={styles.container}>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="topic">Seleccionar Área</label>
            <select
              id="topic"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">-- Seleccionar área --</option>
              {availableTopics.map((topic: Topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {availableTopics.length === 0 && (
              <small className={styles.hint}>
                No hay áreas disponibles. Crea una nueva primero.
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
              disabled={mutation.isPending || availableTopics.length === 0}
              className={styles.submitBtn}
            >
              {mutation.isPending ? 'Agregando...' : 'Agregar Área'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/current-year/${yearId}`)}
              disabled={mutation.isPending}
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