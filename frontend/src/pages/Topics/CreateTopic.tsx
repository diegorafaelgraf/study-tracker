import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTopic } from '../../services/topic.service';
import PageContainer from '../../components/ui/PageContainer/PageContainer';
import styles from './CreateTopic.module.css';
import { useAuth } from '../../context/auth.context';

export default function CreateTopic() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { userId } = useAuth();

  const mutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      setSuccess('Tópico creado exitosamente ✅');
      queryClient.invalidateQueries({ queryKey: ['topics', userId] });
      setTimeout(() => {
        navigate('/topics');
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error creando tópico');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!name.trim()) {
      setError('El nombre del tópico es requerido');
      return;
    }

    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      setLoading(true);
      await mutation.mutateAsync({ name: name.trim() });
    } catch (err) {
      // Error ya manejado por onError
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>Crear Nuevo Tópico</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre del Tópico</label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Piano, Guitarra, Matemáticas, Inglés..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              maxLength={100}
            />
            <small className={styles.hint}>
              Ingresa el nombre de la actividad o materia que quieres trackear
            </small>
          </div>

          <div className={styles.buttons}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Creando...' : 'Crear Tópico'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/topics')}
              disabled={loading}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
