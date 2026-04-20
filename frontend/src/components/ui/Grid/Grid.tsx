import styles from './Grid.module.css';

type Props = {
  children: React.ReactNode;
  columns?: 2 | 3;
  auto?: boolean;
};

export default function Grid({ children, columns = 2, auto = false }: Props) {
  let className = styles.grid;

  if (auto) {
    className += ` ${styles.auto}`;
  } else {
    className += ` ${styles[`cols-${columns}`]}`;
  }

  return <div className={className}>{children}</div>;
}