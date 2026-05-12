import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getClosedYears, getCurrentYear } from '../../services/year.service';
import { getTopics } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';

import { useAuth } from '../../context/auth.context';

import AdminHome from '../Admin/AdminHome';

export default function Home() {

  const navigate = useNavigate();
  const { userId, role } = useAuth();

  const isAdmin = role === 'ADMIN';

  // If the user is an admin, we show them the admin home page instead of the regular home page
  if (isAdmin) {
    return <AdminHome />;
  }

  const { data: closedYears } = useQuery({
    queryKey: ['closed-years', userId],
    queryFn: getClosedYears,
  });

  const { data: currentYear } = useQuery({
    queryKey: ['current-year', userId],
    queryFn: getCurrentYear,
  });

  const { data: topics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });

  const hasOpenedYear = !!currentYear;

  return (
    <PageContainer>
      <Grid>
        <Card onClick={() => navigate('/closed-years')} title="Años cerrados" subtitle={`${closedYears?.length || 0} años`} />
        <Card onClick={() => navigate(`/current-year/${currentYear._id}`)} title="Año vigente" subtitle={currentYear?.year || 'No definido'} />
        <Card onClick={() => navigate('/topics')} title="Tópicos" subtitle={`${topics?.length || 0} tópicos`} />
        <Card onClick={() => navigate('/practices/new')} title="Registrar práctica" subtitle="Ir al formulario" />
        <Card onClick={() => navigate('/years')} disabled={hasOpenedYear} tooltip={hasOpenedYear ? "No se puede agregar un año si hay uno abierto" : undefined} title="Agregar Año" subtitle="Crear nuevo año" />
      </Grid>
    </PageContainer>
  );
}