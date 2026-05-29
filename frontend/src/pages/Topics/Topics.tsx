import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopics } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import styles from './Topics.module.css';
import { useAuth } from '../../context/auth.context';

export default function Topics() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });

  if (isLoading) return <p>Cargando Áreas...</p>;
  if (error) return <p>Error cargando Áreas</p>;

  return (
    <PageContainer title="Áreas" showBackButton={true}>
      <div className={styles.header}>
        <button
          onClick={() => navigate('/topics/create')}
          className={styles.createBtn}
        >
          + Crear Área
        </button>
      </div>

      <List>
        {data?.map((topic: any) => (
          <ListItem
            key={topic._id}
            onClick={() => navigate(`/topics/${topic._id}`)}
          >
            {topic.name}
          </ListItem>
        ))}
      </List>

      {data?.length === 0 && (
        <div className={styles.empty}>
          <p>No tienes áreas creadas aún.</p>
          <p>Haz clic en "Crear Área" para empezar a trackear tus actividades.</p>
        </div>
      )}
    </PageContainer>
  );
}