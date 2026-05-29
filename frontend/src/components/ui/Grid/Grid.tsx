import styles from './Grid.module.css';

type Props = {
  children: React.ReactNode;
  title?: string;
  columns?: 2 | 3;
  auto?: boolean;
};

export default function Grid({ children, title, columns = 3, auto = false }: Props) {
  let className = styles.grid;

  if (auto) {
    className += ` ${styles.auto}`;
  } else {
    className += ` ${styles[`cols-${columns}`]}`;
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      <div className={className} style={{ marginTop: '2rem' }}>
        {children}
      </div>
    </div>
  );
}