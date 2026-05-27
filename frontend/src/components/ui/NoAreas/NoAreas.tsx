import styles from './NoAreas.module.css';

interface NoAreasProps {
  onClick: () => void;
}



const NoAreas = ({ onClick }: NoAreasProps) => {

  return (
    <div className={styles.container}>
      <h1>No tienes ningún área de estudio asignada.</h1>
      <p>
        Para comenzar a registrar tus prácticas, primero debes asignar al menos un área de estudio al año vigente.
      </p>
      <button className={styles.submitBtn} onClick={onClick}>
        Asignar área
      </button>
    </div>
  );
}

export default NoAreas;