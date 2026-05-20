import { useState } from 'react';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';
import Modal from '../../components/ui/Modal/Modal';
import UserForm from '../../components/ui/UserForm/UserForm';

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <PageContainer title="Panel de Administración">
      <Grid>
        <Card onClick={() => openModal()} title='Alta de Usuarios' subtitle='Registrar usuarios del sistema'>
        </Card>
      </Grid>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm title="Agregar Usuario" onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </PageContainer>
  );
}
