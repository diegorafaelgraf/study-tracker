import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import type { Topic } from '../../../types/Topic';

import { getTopics, getTopicsCurrentYear } from '../../../services/topic.service';
import { addTopicToYear } from '../../../services/year-topic.service';

import { useAuth } from '../../../context/auth.context';

import styles from './AssignAreaForm.module.css';

import LoadingScreen from '../LoadingScreen/LoadingScreen';

interface AssignAreaFormProps {
  onCreateNewTopic: () => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignAreaForm({ onCreateNewTopic, onClose, onSuccess }: AssignAreaFormProps) {
  // Form state
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [goalMinutes, setGoalMinutes] = useState('');
  const { t } = useTranslation();

  // Queries
  // Obtenning all areas of the user to show in the dropdown
  const { data: allTopics, isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopics,
  });
  // Obtenning the areas that are already in the year to filter them out from the dropdown
  const { data: yearTopics, isLoading: loadingYearTopics } = useQuery({
    queryKey: ['topics-by-year', userId],
    queryFn: () => getTopicsCurrentYear(),
  });

  // Filtering out the areas that are already in the year from the dropdown options
  const availableTopics = allTopics?.filter((topic: Topic) =>
    !yearTopics?.some((yearTopic: Topic) => yearTopic._id === topic._id)
  ) || [];

  // Mutation
  const mutation = useMutation({
    mutationFn: addTopicToYear,
    onSuccess: () => {
      toast.success(t('assign-area.successful-assigned-area'));
      queryClient.invalidateQueries({ queryKey: ['topics-current-year', userId] });
      queryClient.invalidateQueries({ queryKey: ['topics-by-year', userId] });
      onSuccess();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('assign-area.assigned-area-error'));
    },
  });

  // Handlers
  const handleCrearTopicClick = () => {
    onCreateNewTopic();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const minutes = parseInt(goalMinutes);

    mutation.mutate({
      topicId: selectedTopicId,
      goalMinutes: minutes,
    })
  };

  // Loading state
  const isLoading = loadingTopics || loadingYearTopics;
  const hasNoTopics = availableTopics.length === 0;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('assign-area.assign-area')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="topic">{t('assign-area.select-area')}</label>
          <select
            id="topic"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            required
            disabled={hasNoTopics}
            className={styles.select}
          >
            <option value="">-- {t('assign-area.select-area')} --</option>
            {availableTopics.map((topic: Topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>
          {hasNoTopics ? (
            <div className={styles.emptyState}>
              <p>{t('assign-area.have-not-created-area')}</p>
              <button
                type="button"
                onClick={handleCrearTopicClick}
                className={styles.linkBtn}
              >
                {t('assign-area.create-area')}
              </button>
            </div>
          ) : (
            <small className={styles.hint}>
              {t('assign-area.area-to-assign')}
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="goalMinutes">{t('assign-area.year-goal-minutes')}</label>
          <input
            id="goalMinutes"
            type="number"
            placeholder={t('assign-area.goal-minutes-placeholder')}
            value={goalMinutes}
            onChange={(e) => setGoalMinutes(e.target.value)}
            min="1"
            required
            className={styles.input}
          />
          <small className={styles.hint}>
            {t('assign-area.total-year-goal-minutes')}
          </small>
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            disabled={mutation.isPending || hasNoTopics}
            className={styles.submitBtn}
          >
            {mutation.isPending ? t('assign-area.assigning') : t('assign-area.assign-area')}
          </button>
          <button
            type="button"
            disabled={mutation.isPending}
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            {t('assign-area.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}