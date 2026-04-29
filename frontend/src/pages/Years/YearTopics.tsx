import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTopicsByYear } from '../../services/topic.service';
import { closeYear } from '../../services/year.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import styles from './YearTopics.module.css';
import { useAuth } from '../../context/auth.context';

export default function YearTopics() {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics-by-year', yearId, userId],
    queryFn: () => getTopicsByYear(yearId!),
    enabled: !!yearId,
  });

  const closeYearMutation = useMutation({
    mutationFn: closeYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-year', userId] });
      navigate('/years');
    },
    onError: (err: any) => {
      alert('Error cerrando el año: ' + err.response?.data?.message || 'Error desconocido');
    },
  });

  const handleCloseYear = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cerrar este año?\n\nUna vez cerrado, no podrás volver a abrirlo ni agregar más tópicos o prácticas.'
    );
    if (confirmed && yearId) {
      closeYearMutation.mutate(yearId);
    }
  };

  if (isLoading) return <p>Cargando tópicos...</p>;
  if (error) return <p>Error cargando tópicos</p>;

  return (
    <PageContainer>
      <div className={styles.header}>
        <h1>Tópicos del año</h1>
        <div className={styles.headerActions}>
          <button
            onClick={() => navigate(`/years/${yearId}/add-topic`)}
            className={styles.addBtn}
          >
            + Agregar Tópico
          </button>
          <button
            onClick={handleCloseYear}
            disabled={closeYearMutation.isPending}
            className={styles.closeBtn}
          >
            {closeYearMutation.isPending ? 'Cerrando...' : 'Cerrar Año'}
          </button>
        </div>
      </div>

      <List>
        {data?.map((topic: any) => (
          <ListItem key={topic._id}>
            {topic.name}
          </ListItem>
        ))}
      </List>

      {data?.length === 0 && (
        <div className={styles.empty}>
          <p>No tienes tópicos asociados a este año aún.</p>
          <p>Haz clic en "Agregar Tópico" para empezar a trackear actividades.</p>
        </div>
      )}
    </PageContainer>
  );
}