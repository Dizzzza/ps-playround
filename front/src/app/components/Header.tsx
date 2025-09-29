import { Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from '../styles/Home.module.scss';
import { useDeleteCompletedTasksMutation } from '../lib/tasks/tasks.generated';

interface PageHeaderProps {
  onCreate: () => void;
  onDeleteCompleted?: () => void;
  hasCompletedTasks?: boolean;
}

export function PageHeader({ onCreate, onDeleteCompleted, hasCompletedTasks }: PageHeaderProps) {
  const [deleteCompletedTasks, { loading: deleteLoading }] = useDeleteCompletedTasksMutation();

  const handleDeleteCompleted = async () => {
    try {
      await deleteCompletedTasks();
      message.success('Завершенные задачи удалены');
      onDeleteCompleted?.();
    } catch {
      message.error('Ошибка при удалении завершенных задач');
    }
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Менеджер задач</h1>
      <Space>
        <Popconfirm
          title="Удаление завершенных задач"
          description="Вы уверены, что хотите удалить все завершенные задачи?"
          onConfirm={handleDeleteCompleted}
          okText="Да"
          cancelText="Отмена"
          disabled={!hasCompletedTasks}
        >
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            disabled={!hasCompletedTasks}
          >
            Удалить завершенные
          </Button>
        </Popconfirm>

        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Создать задачу
        </Button>
      </Space>
    </div>
  );
}
