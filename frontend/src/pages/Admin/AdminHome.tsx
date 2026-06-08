import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';
import Modal from '../../components/ui/Modal/Modal';
import UserForm from '../../components/ui/UserForm/UserForm';

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const { t } = useTranslation();

  return (
    <PageContainer title={t('admin.panel-admin')}>
      <Grid>
        <Card onClick={() => openModal()} title={t('admin.alta-usuarios')} subtitle={t('admin.registrar-usuarios')}>
        </Card>
      </Grid>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm title={t('admin.agregar-usuario')} onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </PageContainer>
  );
}
