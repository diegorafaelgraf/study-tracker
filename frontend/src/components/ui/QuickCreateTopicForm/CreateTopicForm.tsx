import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import { createTopic } from '../../../services/topic.service';

import { useAuth } from '../../../context/auth.context';

import { topicIcons } from '../../../constants/topicIcons';

import styles from './CreateTopicForm.module.css';

interface CreateTopicFormProps {
  onSuccess: () => void;
}

export default function CreateTopicForm({ onSuccess }: CreateTopicFormProps) {
  // Form state
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');
  const { userId } = useAuth();
  const { t } = useTranslation();

  // Mutation
  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      toast.success(t('create-topic.area-created-success'));
      queryClient.invalidateQueries({ queryKey: ['topics', userId] });
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t('create-topic.create-area-error'));
    },
  });

  // Handlers
  const handleIconClick = (iconName: string) => {
    // If the clicked icon is already selected (to deselect), only allow if it's not the default icon
    if (selectedIcon === iconName) {
      // If it's the default icon, do nothing (can't deselect it)
      if (iconName !== 'BookOpen') {
        setSelectedIcon('BookOpen');
      }
    } else {
      // If it's a different icon, select that one
      setSelectedIcon(iconName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t('create-topic.area-name-required'));
      return;
    }

    if (name.trim().length < 2) {
      toast.error(t('create-topic.area-name-min-length'));
      return;
    }

    mutation.mutate({
      name: name.trim(), icon: selectedIcon
    });
  };

  // Render form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('create-topic.title')}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">{t('create-topic.name-label')}</label>
          <input
            id="name"
            type="text"
            placeholder={t('create-topic.name-placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
          <small className={styles.hint}>
            {t('create-topic.name-hint')}
          </small>
        </div>

        <div className={styles.iconGrid}>
          {topicIcons.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleIconClick(name)}
              className={
                selectedIcon === name
                  ? styles.selectedIconButton
                  : styles.iconButton
              }
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            disabled={mutation.isPending}
            className={styles.submitBtn}
          >
            {mutation.isPending ? t('create-topic.creating') : t('create-topic.create-area')}
          </button>

          <button
            type="button"
            onClick={onSuccess}
            disabled={mutation.isPending}
            className={styles.cancelBtn}
          >
            {t('create-topic.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}