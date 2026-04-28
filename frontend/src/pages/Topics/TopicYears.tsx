import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getYearsByTopic } from '../../services/year.service';
import type { CSSProperties } from 'react';
import { useAuth } from '../../context/auth.context';

export default function TopicYears() {
  const { topicId } = useParams();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['years-by-topic', topicId, userId],
    queryFn: () => getYearsByTopic(topicId!),
    enabled: !!topicId,
  });

  if (isLoading) return <p>Cargando Años...</p>;
  if (error) return <p>Error cargando Años</p>;

  return (
    <div style={styles.container}>
      <h1>Años del tópico</h1>

      <div style={styles.list}>
        {data?.map((year: any) => (
          <div key={year._id} style={styles.item}>
            {year.year}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '2rem',
  },
  list: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
};