import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopicsByYear } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import styles from './YearTopics.module.css';
import { useAuth } from '../../context/auth.context';

export default function ClosedYearTopics() {
  const { yearId } = useParams();
  const { userId } = useAuth();

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
          <p>Este año no tiene tópicos asociados.</p>
        </div>
      )}
    </PageContainer>
  );
}