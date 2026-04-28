import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import PageContainer from '../../components/ui/PageContainer/PageContainer';
import { getCurrentYear } from '../../services/year.service';
import { createYear } from '../../services/year.service';
import { useAuth } from '../../context/auth.context';


export default function CreateYear() {
  const [year, setYear] = useState("");
  const presentYear = new Date().getFullYear();

  // Extraer userId del token
  const { token } = useAuth();
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = payload?.sub;

  const { data: currentYear } = useQuery({
    queryKey: ['current-year', userId],
    queryFn: getCurrentYear,
  });

  const mutation = useMutation({
    mutationFn: createYear,
    onSuccess: () => {
      alert('Año creado ✅');
      setYear("");
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Error creando año');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year) {
      alert('El año es obligatorio');
      return;
    }

    // 🚨 Validación frontend
    if (closed && currentYear) {
      alert('Ya existe un año abierto');
      return;
    }

    mutation.mutate({
      year
    });
  };

  return (
    <PageContainer>
      <h1>Crear Año</h1>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Year */}
        <input
          type="number"
          placeholder={`${presentYear}`}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.input}
        />

        {/* WARNING */}
        {currentYear && (
          <p style={{ color: 'orange' }}>
            Ya existe un año abierto: {currentYear.name}
          </p>
        )}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creando...' : 'Crear'}
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
  checkbox: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
};