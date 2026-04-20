import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTopics } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';

export default function Topics() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });

  if (isLoading) return <p>Cargando Tópicos...</p>;
  if (error) return <p>Error cargando Tópicos</p>;

  return (
    <PageContainer>
      <h1>Tópicos</h1>

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
    </PageContainer>
  );
}