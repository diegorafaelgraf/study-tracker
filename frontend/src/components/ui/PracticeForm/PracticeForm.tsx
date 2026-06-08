import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import { getTopicsCurrentYear } from '../../../services/topic.service';
import { getCurrentYear } from '../../../services/year.service';
import { createPractice } from '../../../services/practice.service';

import { useAuth } from '../../../context/auth.context';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

import styles from './PracticeForm.module.css';

interface PracticeFormProps {
  onSuccess: () => void;
  yearTopicId?: string;
}

export default function PracticeForm({ onSuccess, yearTopicId: selectedYearTopicId }: PracticeFormProps) {
  // Form state
  const [yearTopicId, setYearTopicId] = useState(selectedYearTopicId || '');
  const [minutes, setMinutes] = useState('');
  const [date, setDate] = useState('');
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation()

  // Queries
  const { data: topics, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['topics-current-year', userId],
    queryFn: getTopicsCurrentYear,
  });
  const { data: currentYear, isLoading: isCurrentYearLoading } = useQuery({
    queryKey: ['currentYear', userId],
    queryFn: getCurrentYear,
  });

  const selectedTopic = topics?.find((t: any) => t.yearTopicId === selectedYearTopicId);

  // Sync the selected yearTopicId prop with local state if it changes
  useEffect(() => {
    if (selectedYearTopicId) {
      setYearTopicId(selectedYearTopicId);
    }
  }, [selectedYearTopicId]);

  // Mutation
  const mutation = useMutation({
    mutationFn: createPractice,
    onSuccess: () => {
      toast.success(t('practice.practice-created-successfully'));
      queryClient.invalidateQueries({ queryKey: ['topics-current-year', userId] });
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.message || t('practice.practice-creating-error'));
    }
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!yearTopicId || !minutes || !date) {
      toast.error(t('practice.complete-required-fields'));
      return;
    }

    mutation.mutate({
      yearTopicId,
      durationMinutes: Number(minutes),
      date: new Date(date).toISOString()
    });
  };

  // Loading state
  const isLoading = isTopicsLoading || isCurrentYearLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('practice.register-practice')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formGroup}>
          <label htmlFor="name">{t('practice.area')}</label>
          {selectedYearTopicId ? (
            <div className={styles.readOnlyField}>
              {selectedTopic?.name || t('practice.selected-area')}
            </div>
          ) : (
            <select
              value={yearTopicId}
              onChange={(e) => setYearTopicId(e.target.value)}
              className={styles.input}
              disabled={mutation.isPending}
            >
              <option value="">{t('practice.select-area')}</option>
              {topics?.map((t: any) => (
                <option key={t.yearTopicId} value={t.yearTopicId}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">{t('practice.minutes')}</label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="Minutos"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className={styles.input}
            disabled={mutation.isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">{t('practice.date')}</label>
          <input
            type="date"
            min={`${currentYear?.year}-01-01`}
            max={`${currentYear?.year}-12-31`}
            placeholder="Fecha"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
            disabled={mutation.isPending}
          />
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t('practice.saving') : t('practice.save')}
          </button>

          <button
            type="button"
            onClick={onSuccess}
            disabled={mutation.isPending}
            className={styles.cancelBtn}
          >
            {t('practice.cancel')}
          </button>
        </div>

      </form>
    </div >
  );
}