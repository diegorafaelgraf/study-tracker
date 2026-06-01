import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { getCurrentYear, closeYear } from '../../services/year.service';
import { getTopicsCurrentYear } from '../../services/topic.service';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import Card from '../../components/ui/Card/Card';
import Grid from '../../components/ui/Grid/Grid';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar';
import Modal from '../../components/ui/Modal/Modal';
import PracticeForm from '../../components/ui/PracticeForm/PracticeForm';
import AddPracticeButton from '../../components/ui/AddPracticeButton/AddPracticeButton';
import { topicIcons } from '../../constants/topicIcons';
import { CloseYearModal } from '../../components/ui/CloseYearModal/CloseYearModal';
import NoAreas from '../../components/ui/NoAreas/NoAreas';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import AssignAreaForm from '../../components/ui/AssignAreaForm/AssignAreaForm';
import CreateTopicForm from '../../components/ui/QuickCreateTopicForm/CreateTopicForm';

import { useAuth } from '../../context/auth.context';

import AdminHome from '../Admin/AdminHome';

export default function Home() {

  // Home page state
  const { userId, role } = useAuth();

  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedPracticeYearTopicId, setSelectedPracticeYearTopicId] = useState('');
  const openPracticeModal = (yearTopicId?: string) => {
    setSelectedPracticeYearTopicId(yearTopicId ?? '');
    setIsPracticeModalOpen(true);
  };

  const [isAssignAreaModalOpen, setIsAssignAreaModalOpen] = useState(false);
  const openAssignAreaModal = () => setIsAssignAreaModalOpen(true);

  const [isCreateAreaModalOpen, setIsCreateAreaModalOpen] = useState(false);

  const [isCloseYearModalOpen, setIsCloseYearModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const isAdmin = role === 'ADMIN';

  // If the user is an admin, we show them the admin home page instead of the regular home page
  if (isAdmin) {
    return <AdminHome />;
  }

  // Queries
  const { data: currentYear, isLoading: isLoadingYear } = useQuery({
    queryKey: ['current-year', userId],
    queryFn: getCurrentYear,
  });

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery({
    queryKey: ['topics-current-year', userId],
    queryFn: getTopicsCurrentYear,
    enabled: !!currentYear,
  });

  // Mutations
  const closeYearMutation = useMutation({
    mutationFn: closeYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-year', userId] });
      toast.success('Año cerrado exitosamente ✅');
    },
    onError: (err: any) => {
      alert('Error cerrando el año: ' + err.response?.data?.message || 'Error desconocido');
    },
  });

  // Loading state
  const isLoading = isLoadingYear || isLoadingTopics;

  // Effects
  useEffect(() => {
    if (!currentYear?.year) return;

    const openedYear = Number(currentYear.year);
    const actualYear = new Date().getFullYear();

    setIsCloseYearModalOpen(openedYear !== actualYear);
  }, [currentYear]);

  // Handlers
  const handleCloseYear = async () => {
    await closeYearMutation.mutateAsync(currentYear._id);
    setIsCloseYearModalOpen(false);
  };

  const handleCreateNewTopic = () => {
    setIsAssignAreaModalOpen(false);
    setIsCreateAreaModalOpen(true);
  };

  const handleCloseCreateAreaModal = () => {
    setIsCreateAreaModalOpen(false);
    setIsAssignAreaModalOpen(true);
  };

  // If the data is still loading, we show a loading screen
  if (isLoading) {
    return (<LoadingScreen />);
  }

  // Render home page
  return (
    <PageContainer title={`Año vigente: ${currentYear?.year || 'No existe año vigente'}`} showBackButton={false}>
      {topics && topics.length > 0 ? (
        <Grid columns={2}>
          {topics.map((topic: any) => {
            const progress = topic.goalMinutes > 0 ? (topic.practicedMinutes / topic.goalMinutes) * 100 : 0;
            const topicIcon = topicIcons.find((item) => item.name === topic.icon)?.icon;
            const IconComponent = topicIcon ? topicIcon : undefined;

            return (
              <Card
                key={topic._id}
                title={topic.name}
                subtitle={`${topic.practicedMinutes} / ${topic.goalMinutes} minutos de estudio`}
                message={
                  <>
                    Minutos diarios necesarios para cumplir objetivo: {' '}
                    <b style={{ color: '#17640e', fontWeight: 'bold', fontSize: '1.25rem' }}>{topic.minutesPerDay.toFixed(0)}</b>
                  </>
                }
                icon={IconComponent ? <IconComponent /> : undefined}
                button={<AddPracticeButton onClick={() => openPracticeModal(topic.yearTopicId)} />}
              >
                <ProgressBar progress={progress} text="Progresaste un" />
              </Card>
            );
          })}
          <Card
            key="assign-area-card"
            title="Asignar área"
            subtitle="Agregar una nueva área al año vigente"
            message="Haz clic para asignar un área al año y comenzar a registrar minutos de estudio."
            onClick={openAssignAreaModal}
            highlight
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <span style={{ fontSize: '3rem', color: '#5b75ff' }}>+</span>
            </div>
          </Card>
        </Grid>
      ) : (
        <NoAreas onClick={openAssignAreaModal} />
      )}

      <Modal isOpen={isPracticeModalOpen} onClose={() => setIsPracticeModalOpen(false)}>
        <PracticeForm
          yearTopicId={selectedPracticeYearTopicId}
          onSuccess={() => setIsPracticeModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isAssignAreaModalOpen} onClose={() => setIsAssignAreaModalOpen(false)}>
        <AssignAreaForm
          onCreateNewTopic={handleCreateNewTopic}
          onClose={() => setIsAssignAreaModalOpen(false)}
          onSuccess={() => setIsAssignAreaModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isCreateAreaModalOpen} onClose={handleCloseCreateAreaModal}>
        <CreateTopicForm onSuccess={handleCloseCreateAreaModal} />
      </Modal>

      <CloseYearModal isOpen={isCloseYearModalOpen} onCloseYear={handleCloseYear} onRemindLater={() => setIsCloseYearModalOpen(false)}>
      </CloseYearModal>

    </PageContainer>
  );
}