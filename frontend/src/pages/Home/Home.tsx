import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
import YearTopicStats from '../../components/ui/YearTopicStats/YearTopicStats'

import { useAuth } from '../../context/auth.context';

import AdminHome from '../Admin/AdminHome';

export default function Home() {

  // Home page state
  const { userId, role } = useAuth();

  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedYearTopicId, setSelectedYearTopicId] = useState('');
  const [selectedTopicName, setSelectedTopicName] = useState('');
  const openPracticeModal = (yearTopicId?: string) => {
    setSelectedYearTopicId(yearTopicId ?? '');
    setIsPracticeModalOpen(true);
  };

  const [isAssignAreaModalOpen, setIsAssignAreaModalOpen] = useState(false);
  const openAssignAreaModal = () => setIsAssignAreaModalOpen(true);

  const [isCreateAreaModalOpen, setIsCreateAreaModalOpen] = useState(false);

  const [isCloseYearModalOpen, setIsCloseYearModalOpen] = useState(false);

  const [isStatsAreaModalOpen, setIsStatsAreaModalOpen] = useState(false);
  const openStatsModal = (yearTopicId?: string, topicName?: string) => {
    setSelectedYearTopicId(yearTopicId ?? '');
    setSelectedTopicName(topicName ?? '');
    setIsStatsAreaModalOpen(true);
  };

  const hideTooltip = isPracticeModalOpen || isAssignAreaModalOpen || isCreateAreaModalOpen || isCloseYearModalOpen;

  const queryClient = useQueryClient();

  const isAdmin = role === 'ADMIN';

  const { t } = useTranslation();

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
      toast.success(t('dashboard.successful-closed-year'));
    },
    onError: (err: any) => {
      toast.error(t('dashboard.closing-year-error') + err.response?.data?.message || t('dashboard.unknown-error'));
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
    <PageContainer title={`${t('dashboard.current-year')} ${currentYear?.year || t('dashboard.current-year-not-exist')}`} showBackButton={false}>
      {topics && topics.length > 0 ? (
        <Grid columns={2}>
          {topics.map((topic: any) => {
            const progress = topic.progressPercentage;
            const topicIcon = topicIcons.find((item) => item.name === topic.icon)?.icon;
            const IconComponent = topicIcon ? topicIcon : undefined;

            // Function to determine the color of the message based on the user's progress
            const message = () => {
              const color = topic.totalTodayPractices >= topic.minutesPerDay ? '#17640e' : '#ff0000';
              return (
                <>
                  {t('dashboard.today-total-minutes')} {' '}
                  <b style={{ color: color, fontWeight: 'bold'}}>{topic.totalTodayPractices.toFixed(0)} / {topic.minutesPerDay.toFixed(0)}</b>
                </>
              );
            }

            return (
              <Card
                key={topic._id}
                title={topic.name}
                hideTooltip={hideTooltip}
                tooltip={t('dashboard.view-detailed-statistics')}
                onClick={() => openStatsModal(topic.yearTopicId, topic.name)}
                subtitle={`${t('dashboard.needed-minutes')} ${topic.minutesPerDay.toFixed(0)}`}
                message={message()}
                icon={IconComponent ? <IconComponent /> : undefined}
                button={<AddPracticeButton onClick={() => openPracticeModal(topic.yearTopicId)} tooltip={t('dashboard.track-study-time')} />}
              >
                <ProgressBar progress={progress} text_before={t('dashboard.your-progress-is')} text_after={` (${topic.practicedMinutes} / ${topic.goalMinutes} ${t('dashboard.minutes')})`} />
              </Card>
            );
          })}
          <Card
            key="assign-area-card"
            title={t('dashboard.assign-area')}
            subtitle={t('dashboard.assign-area-current-year')}
            message={t('dashboard.click-here-to-assign-area')}
            onClick={openAssignAreaModal}
            hideTooltip={hideTooltip}
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

      <Modal isOpen={isPracticeModalOpen} onClose={() => setIsPracticeModalOpen(false)} modalToClose={() => setIsStatsAreaModalOpen(false)}>
        <PracticeForm
          yearTopicId={selectedYearTopicId}
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

      <Modal isOpen={isStatsAreaModalOpen} onClose={() => { setIsStatsAreaModalOpen(false) }}>
        <YearTopicStats yearTopicId={selectedYearTopicId} topicName={selectedTopicName} />
      </Modal>

      <CloseYearModal isOpen={isCloseYearModalOpen} onCloseYear={handleCloseYear} onRemindLater={() => setIsCloseYearModalOpen(false)}>
      </CloseYearModal>

    </PageContainer>
  );
}