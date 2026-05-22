import ReactModal from 'react-modal';

import styles from './CloseYearModal.module.css';

ReactModal.setAppElement('#root');

type Props = {
  isOpen: boolean;
  onCloseYear: () => void;
  onRemindLater: () => void;
}

export function CloseYearModal({
  isOpen,
  onCloseYear,
  onRemindLater,
}: Props) {
  if (!isOpen) return null;
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRemindLater}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Año anterior detectado</h2>

      <p>
        Detectamos que el año abierto no coincide con el año actual.
        ¿Querés cerrarlo?.
        <br />
        <br />
        <b>Recordá que una vez cerrado no podrás agregar mas prácticas.</b>
      </p>

      <div className={styles.actions}>
        <button onClick={onRemindLater} className={styles.submitBtn}>
          Recordármelo más tarde
        </button>

        <button onClick={onCloseYear} className={styles.cancelBtn}>
          Cerrar año
        </button>
      </div>
    </ReactModal>
  );
}