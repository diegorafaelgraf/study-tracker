import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopicsByYear } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import { useAuth } from '../../context/auth.context';

export default function ClosedYearTopics() {
  const { yearId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['topics-by-year', yearId, userId],
    queryFn: () => getTopicsByYear(yearId!),
    enabled: !!yearId,
  });

  if (isLoading) return <p>Cargando áreas...</p>;
  if (error) return <p>Error cargando áreas</p>;

  return (
    <PageContainer title="Áreas del año" showBackButton={true}>

      <List>
        {data?.map((topic: any) => (
          <ListItem key={topic.yearTopicId} onClick={() => navigate(`/year-topic/${topic.yearTopicId}`)}>
            {topic.name}
          </ListItem>
        ))}
      </List>

      {data?.length === 0 && (
        <div>
          <p>Este año no tiene áreas asociadas.</p>
        </div>
      )}
    </PageContainer>
  );
}