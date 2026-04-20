import styles from './ListItem.module.css';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function ListItem({ children, onClick }: Props) {
  return (
    <div className={styles.item} onClick={onClick}>
      {children}
    </div>
  );
}