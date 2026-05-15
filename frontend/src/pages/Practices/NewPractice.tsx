import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { getTopicsCurrentYear } from '../../services/topic.service';
import { getCurrentYear } from '../../services/year.service';
import { createPractice } from '../../services/practice.service';

import { useAuth } from '../../context/auth.context';

import PageContainer from '../../components/ui/PageContainer/PageContainer';


export default function NewPractice() {
  const [yearTopicId, setYearTopicId] = useState('');
  const [minutes, setMinutes] = useState('');
  const [date, setDate] = useState('');
  const { userId } = useAuth();

  const { data: topics } = useQuery({
    queryKey: ['topics', userId],
    queryFn: getTopicsCurrentYear,
  });

  const { data: currentYear } = useQuery({
    queryKey: ['currentYear', userId],
    queryFn: getCurrentYear,
  });

  const mutation = useMutation({
    mutationFn: createPractice,
    onSuccess: () => {
      alert('Minutos de estudio registrados ✅');
      setMinutes('');
      setDate('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!yearTopicId || !minutes || !date) {
      alert('Completa los campos obligatorios');
      return;
    }

    mutation.mutate({
      yearTopicId,
      durationMinutes: Number(minutes),
      date: new Date(date).toISOString()
    });
  };

  return (
    <PageContainer title="Registrar minutos de estudio" showBackButton={true}>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* TOPIC */}
        <select
          value={yearTopicId}
          onChange={(e) => setYearTopicId(e.target.value)}
          style={styles.input}
        >
          <option value="">Seleccionar área</option>
          {topics?.map((t: any) => (
            <option key={t.yearTopicId} value={t.yearTopicId}>
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

        {/* DATE */}
        <input
          type="date"
          min={`${currentYear?.year}-01-01`}
          max={`${currentYear?.year}-12-31`}
          placeholder="Fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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