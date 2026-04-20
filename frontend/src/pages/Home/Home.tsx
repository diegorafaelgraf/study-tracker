import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getClosedYears, getCurrentYear } from '../../services/year.service';
import { getTopics } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';

export default function Home() {

  const navigate = useNavigate();

  const { data: closedYears } = useQuery({
    queryKey: ['closed-years'],
    queryFn: getClosedYears,
  });

  const { data: currentYear } = useQuery({
    queryKey: ['current-year'],
    queryFn: getCurrentYear,
  });

  const { data: topics } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });

  return (
    <PageContainer>
      <h1>Study Tracker</h1>

      <Grid>

        {/* Card 1 */}
        <Card onClick={() => navigate('/closed-years')}>
          <h2>Años cerrados</h2>
          <p>{closedYears?.length || 0} años</p>
        </Card>

        {/* Card 2 */}
        <Card onClick={() => navigate(`/current-year/${currentYear._id}`)}>
          <h2>Año vigente</h2>
          <p>{currentYear?.year || 'No definido'}</p>
        </Card>

        {/* Card 3 */}
        <Card onClick={() => navigate('/topics')}>
          <h2>Tópicos</h2>
          <p>{topics?.length || 0} tópicos</p>
        </Card>

        {/* Card 4 */}
        <Card onClick={() => navigate('/practices/new')}>
          <h2>Registrar práctica</h2>
          <p>Ir al formulario</p>
        </Card>

      </Grid>
    </PageContainer>
  );
}