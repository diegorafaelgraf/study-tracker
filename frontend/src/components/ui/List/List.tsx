import styles from './List.module.css';

export default function List({ children }: { children: React.ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}