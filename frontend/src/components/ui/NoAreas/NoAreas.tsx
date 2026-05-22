import styles from './NoAreas.module.css';
const NoAreas = () => {

  return (
    <div className={styles.container}>
      <h1>No tienes ningún área de estudio asignada.</h1>
      <p>
        Para comenzar a registrar tus prácticas, primero debes asignar al menos un área de estudio al año vigente.
      </p>
      {/* 
      //TODO: Implementar la funcionalidad para asignar un area de estudio al año vigente vía modal.
      <button className={styles.submitBtn} onClick={() => navigate('/year-topics/assign')}>
        Asignar área
      </button> */}
    </div>
  );
}

export default NoAreas;