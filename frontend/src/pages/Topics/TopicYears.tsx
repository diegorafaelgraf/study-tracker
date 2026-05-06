import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getYearsByTopic } from '../../services/year.service';
import PageContainer from '../../components/ui/PageContainer/PageContainer';
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
    <PageContainer title="Años del tópico" showBackButton={true}>
      <div style={styles.list}>
        {data?.map((year: any) => (
          <div key={year._id} style={styles.item}>
            {year.year}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

const styles: { [key: string]: CSSProperties } = {
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