import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopicsByYear } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';

export default function YearTopics() {
  const { yearId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics-by-year', yearId],
    queryFn: () => getTopicsByYear(yearId!),
    enabled: !!yearId,
  });

  if (isLoading) return <p>Cargando tópicos...</p>;
  if (error) return <p>Error cargando tópicos</p>;

  return (
    <PageContainer>
      <h1>Tópicos del año</h1>

      <List>
        {data?.map((topic: any) => (
          <ListItem key={topic._id}>
            {topic.name}
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
}