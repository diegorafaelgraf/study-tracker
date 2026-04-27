import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getClosedYears, getCurrentYear } from '../../services/year.service';
import { getTopics } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';
import { useAuth } from '../../context/auth.context';
import AdminHome from '../Admin/AdminHome';

export default function Home() {

  const navigate = useNavigate();
  const { token } = useAuth();

  // Extraer rol del token
  const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === 'ADMIN' : false;

  // Si es admin, mostrar AdminHome
  if (isAdmin) {
    return <AdminHome />;
  }

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

  const [hasOpenedYear, setHasOpenedYear] = useState(false);

  useEffect(() => {
    if (currentYear) {
      setHasOpenedYear(true);
    }
  }, [currentYear]);

  return (
    <PageContainer>

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

      <h3 style={{ marginTop: '3rem' }}>Administración</h3>

      <Grid columns={3}>
        <Card onClick={() => navigate('/admin/years')} disabled={hasOpenedYear} tooltip={hasOpenedYear ? "No se puede agregar un año si hay uno abierto" : undefined}>
          <h3>Agregar Año</h3>
        </Card>

        <Card onClick={() => navigate('/admin/topics')}>
          <h3>Agregar Tópico</h3>
        </Card>

        <Card onClick={() => navigate('/admin/close-year')}>
          <h3>Cerrar Año Actual</h3>
        </Card>
      </Grid>
    </PageContainer>
  );
}