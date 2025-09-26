import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../styles/Home.module.scss';

interface PageHeaderProps {
  onCreate: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onCreate }) => (
  <div className={styles.header}>
    <h1 className={styles.title}>Менеджер задач</h1>
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
        Создать задачу
      </Button>
    </Space>
  </div>
);
