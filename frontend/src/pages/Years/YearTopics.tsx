import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopicsByYear } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import styles from './YearTopics.module.css';

export default function YearTopics() {
  const { yearId } = useParams();
  const navigate = useNavigate();

  // Extraer userId del token
  const { token } = useAuth();
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = payload?.sub;

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics-by-year', yearId, userId],
    queryFn: () => getTopicsByYear(yearId!),
    enabled: !!yearId,
  });

  if (isLoading) return <p>Cargando tópicos...</p>;
  if (error) return <p>Error cargando tópicos</p>;

  return (
    <PageContainer>
      <div className={styles.header}>
        <h1>Tópicos del año</h1>
        <button
          onClick={() => navigate(`/years/${yearId}/add-topic`)}
          className={styles.addBtn}
        >
          + Agregar Tópico
        </button>
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