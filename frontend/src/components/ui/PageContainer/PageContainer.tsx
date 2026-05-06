import styles from './PageContainer.module.css';
import BackButton from '../BackButton/BackButton';

type PageContainerProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
};

export default function PageContainer({ title, subtitle, children, showBackButton = false }: PageContainerProps) {
  return (
    <div className={styles.container}>
      {showBackButton && <BackButton />}
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
}