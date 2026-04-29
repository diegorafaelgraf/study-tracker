import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTopicsCurrentYear } from '../../services/topic.service';
import { createPractice } from '../../services/practice.service';
import { useAuth } from '../../context/auth.context';

import PageContainer from '../../components/ui/PageContainer/PageContainer';

export default function NewPractice() {
  const [topicId, setTopicId] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const { userId } = useAuth();

  const { data: topics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopicsCurrentYear,
  });

  const mutation = useMutation({
    mutationFn: createPractice,
    onSuccess: () => {
      alert('Práctica registrada ✅');
      setMinutes('');
      setDescription('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicId || !minutes) {
      alert('Completa los campos obligatorios');
      return;
    }

    mutation.mutate({
      topicId,
      minutes: Number(minutes),
      description,
    });
  };

  return (
    <PageContainer>
      <h1>Registrar práctica</h1>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* TOPIC */}
        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          style={styles.input}
        >
          <option value="">Seleccionar tópico</option>
          {topics?.map((t: any) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* MINUTES */}
        <input
          type="number"
          placeholder="Minutos"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          style={styles.input}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Guardar
        </button>

      </form>
    </PageContainer>
  );
}

const styles = {
  form: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    maxWidth: '400px',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#333',
    color: 'white',
    cursor: 'pointer',
  },
};