import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClosedYears } from '../../services/year.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';
import { useAuth } from '../../context/auth.context';

export default function ClosedYears() {
  const navigate = useNavigate();

  // Extraer userId del token
  const { token } = useAuth();
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = payload?.sub;

  const { data, isLoading, error } = useQuery({
    queryKey: ['closed-years', userId],
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