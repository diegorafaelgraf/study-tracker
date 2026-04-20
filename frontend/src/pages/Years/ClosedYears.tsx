import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClosedYears } from '../../services/year.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';

export default function ClosedYears() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['closed-years'],
    queryFn: getClosedYears,
  });

  if (isLoading) return <p>Cargando años...</p>;
  if (error) return <p>Error cargando años</p>;

  return (
    <PageContainer>
      <h1>Años cerrados</h1>

      <List>
        {data?.map((year: any) => (
          <ListItem
            key={year._id}
            onClick={() => navigate(`/closed-years/${year._id}`)}
          >
            {year.year}
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
}