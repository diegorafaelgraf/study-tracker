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

  // Extraer userId del token
  const { token } = useAuth();
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = payload?.sub;

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });

  if (isLoading) return <p>Cargando Tópicos...</p>;
  if (error) return <p>Error cargando Tópicos</p>;

  return (
    <PageContainer>
      <div className={styles.header}>
        <h1>Tópicos</h1>
        <button
          onClick={() => navigate('/topics/create')}
          className={styles.createBtn}
        >
          + Crear Tópico
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
          <p>No tienes tópicos creados aún.</p>
          <p>Haz clic en "Crear Tópico" para empezar a trackear tus actividades.</p>
        </div>
      )}
    </PageContainer>
  );
}