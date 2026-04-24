import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <h1>Panel de Administración</h1>

      <Grid>
        <Card onClick={() => navigate('/admin/users')}>
          <h2>ABM de Usuarios</h2>
          <p>Gestionar usuarios del sistema</p>
        </Card>
      </Grid>
    </PageContainer>
  );
}
