import styles from './Card.module.css';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Card({ children, onClick }: Props) {
  return (
    <div className={styles.card} onClick={onClick}>
      {children}
    </div>
  );
}