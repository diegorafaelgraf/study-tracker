import { useQuery } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import List from '../../../components/ui/List/List';
import ListItem from '../../../components/ui/ListItem/ListItem';
import ProgressBar from '../ProgressBar/ProgressBar';

import { getYearTopicStats } from '../../../services/year-topic.service';

import { useAuth } from '../../../context/auth.context';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

import styles from './YearTopicStats.module.css';

interface YearTopicStatsProps {
  yearTopicId: string;
  topicName: string
}

export default function YearTopicStats({ yearTopicId, topicName }: YearTopicStatsProps) {
  // State  
  const { userId } = useAuth();
  const { t } = useTranslation();

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['topics-stats-current-year', userId, yearTopicId],
    queryFn: () => getYearTopicStats(yearTopicId)
  });


  // Loading state
  const isLoading = isStatsLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{topicName}</h1>
      <h2 className={styles.subtitle}>{t('year-topic-stats.title')}</h2>

      <div className={styles.formGroup}>
        {stats ? (
          <>
            <List>
              <ListItem>
                <label htmlFor="name">{t('year-topic-stats.annual-goal', { minutes: stats.annualGoalMinutes })}</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">{t('year-topic-stats.daily-goal', { minutes: stats.dayGoalMinutes.toFixed(0) })}</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">{t('year-topic-stats.current-pace', { minutes: stats.neededDailyMinutes.toFixed(0) })}</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">{t('year-topic-stats.total-practiced', { minutes: stats.annualPracticedMinutes.toFixed(0) })}</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">{t('year-topic-stats.remaining', { minutes: stats.annualRemainingMinutes.toFixed(0) })}</label>
              </ListItem>
              <ListItem>
                <ProgressBar progress={stats.progressPercentage} text={t('year-topic-stats.real-progress')} />
                <ProgressBar progress={stats.expectedProgressPercentage} text={t('year-topic-stats.expected-progress')} />
                <ProgressBar progress={stats.planCompletionPercentage} text={t('year-topic-stats.plan-completion')} />
              </ListItem>
            </List>
          </>
        ) : (
          <p>{t('year-topic-stats.no-data')}</p>
        )}
      </div>
    </div >
  );
}