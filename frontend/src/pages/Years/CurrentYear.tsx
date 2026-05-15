import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCurrentYear } from '../../services/year.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import List from '../../components/ui/List/List';
import ListItem from '../../components/ui/ListItem/ListItem';

import { useAuth } from '../../context/auth.context';

export default function CurrentYear() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['current-year', userId],
    queryFn: getCurrentYear,
  });

  if (isLoading) return <p>Cargando áreas del año vigente...</p>;
  if (error) return <p>Error cargando áreas del año vigente</p>;

  return (
    <PageContainer title="Año Vigente" showBackButton={true}>

      <List>
        {data?.map((year: any) => (
          <ListItem
            key={year._id}
            onClick={() => navigate(`/current-years/${year._id}`)}
          >
            {year.year}
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
}