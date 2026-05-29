import styles from './AddPractice.module.css';

type AddPracticeButtonProps = {
  className?: string;
  onClick?: () => void;
};

export default function AddPracticeButton({ className, onClick }: AddPracticeButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.AddPracticeButton} ${className || ''}`}
      aria-label="Agregar minutos de estudio"
      onClick={onClick}
    >
      +
    </button>
  );
}