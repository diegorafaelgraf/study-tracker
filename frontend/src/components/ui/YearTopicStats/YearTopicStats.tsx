import { useQuery } from '@tanstack/react-query';

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
      <h2 className={styles.subtitle}>Estadísticas:</h2>

      <div className={styles.formGroup}>
        {stats ? (
          <>
            <List>
              <ListItem>
                <label htmlFor="name">Te planteaste estudiar <b style={{ color: 'green' }}>{stats.annualGoalMinutes}</b> minutos al año.</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">Para cumplir el objetivo, necesitas estudiar <b style={{ color: 'green' }}>{stats.dayGoalMinutes.toFixed(0)}</b> minutos diarios.</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">Con el ritmo actual de estudio, para cumplir el objetivo necesitas estudiar <b style={{ color: 'green' }}>{stats.neededDailyMinutes.toFixed(0)}</b> minutos diarios.</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">Llevas estudiados en total <b style={{ color: 'green' }}>{stats.annualPracticedMinutes.toFixed(0)}</b> minutos durante el año.</label>
              </ListItem>
              <ListItem>
                <label htmlFor="name">Para completar el objetivo, te faltan <b style={{ color: 'green' }}>{stats.annualRemainingMinutes.toFixed(0)}</b> minutos durante el año.</label>
              </ListItem>
              <ListItem>
                <ProgressBar progress={stats.progressPercentage} text="Avance Real" />
                <ProgressBar progress={stats.expectedProgressPercentage} text="Avance Esperado" />
                <ProgressBar progress={stats.planCompletionPercentage} text="Cumplimiento del Plan" />
              </ListItem>
            </List>
          </>
        ) : (
          <p>No hay estadísticas disponibles para este tema.</p>
        )}
      </div>
    </div >
  );
}