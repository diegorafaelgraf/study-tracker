import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getYearTopicStats } from '../../services/year-topic.service';

import { useAuth } from '../../context/auth.context';

import PageContainer from '../../components/ui/PageContainer/PageContainer';


export default function YearTopicStats() {
  const { yearTopicId } = useParams();
  const { userId } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['year-topic-stats', yearTopicId, userId],
    queryFn: () => getYearTopicStats(yearTopicId!),
    enabled: !!yearTopicId,
  });

  return (
    <PageContainer title="Estadísticas" showBackButton={true}>
      {isLoading && <p>Cargando estadísticas...</p>}
      {error && <p>Error cargando estadísticas</p>}
      {stats && (
        <div>
          <p><strong>Minutos practicados:</strong> {stats.annualPracticedMinutes} / {stats.annualGoalMinutes}</p>
          <p><strong>Minutos restantes:</strong> {stats.annualRemainingMinutes}</p>
          <p><strong>Días transcurridos:</strong> {stats.daysTranscurred}</p>
          <p><strong>Días restantes:</strong> {stats.daysRemaining}</p>
          <p><strong>Minutos diarios necesarios para alcanzar la meta:</strong> {stats.neededDailyMinutes.toFixed(2)}</p>
        </div>
      )}
    </PageContainer>
  );
}