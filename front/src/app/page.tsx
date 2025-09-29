'use client';

import { useState } from 'react';
import { Card, message } from 'antd';
import { TaskTable } from './components/TaskTable';
import { TaskModal } from './components/TaskModal';
import { PageHeader } from './components/Header';
import {
  useTaskManyQuery,
  useTaskUpdateByIdMutation,
  useTaskCreateMutation,
  useTaskRemoveByIdMutation,
  TaskManyQuery,
} from './lib/tasks/tasks.generated';
import { UpdateByIdTaskInput, CreateOneTaskInput } from '@/generated/types.generated';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskManyQuery['taskMany'][number] | null>(null);

  const { data, loading, refetch } = useTaskManyQuery();
  const [updateTask] = useTaskUpdateByIdMutation();
  const [createTask] = useTaskCreateMutation();
  const [deleteTask] = useTaskRemoveByIdMutation();

  const tasks = data?.taskMany ?? [];

  const handleCreate = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEdit = (task: TaskManyQuery['taskMany'][number]) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSubmit = async (values: Partial<UpdateByIdTaskInput | CreateOneTaskInput>) => {
    try {
      if (editingTask) {
        await updateTask({
          variables: {
            _id: editingTask._id,
            record: values as UpdateByIdTaskInput,
          },
        });
        message.success('Задача обновлена');
      } else {
        await createTask({
          variables: {
            record: values as CreateOneTaskInput,
          },
        });
        message.success('Задача создана');
      }
      setModalVisible(false);
      refetch();
    } catch {
      message.error('Ошибка при сохранении задачи');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({ variables: { _id: id } });
      message.success('Задача удалена');
      refetch();
    } catch {
      message.error('Ошибка при удалении задачи');
    }
  };

  const handleToggleComplete = async (task: TaskManyQuery['taskMany'][number]) => {
    try {
      await updateTask({
        variables: {
          _id: task._id,
          record: { completed: !task.completed },
        },
      });
      message.success(`Задача отмечена как ${task.completed ? 'незавершенная' : 'завершенная'}`);
      refetch();
    } catch {
      message.error('Ошибка при обновлении задачи');
    }
  };

  const completedTasks = tasks.filter((task) => task.completed);
  const hasCompletedTasks = completedTasks.length > 0;

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader
          onCreate={handleCreate}
          onDeleteCompleted={refetch}
          hasCompletedTasks={hasCompletedTasks}
        />

        <TaskTable
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />

        <TaskModal
          visible={modalVisible}
          editingTask={editingTask}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
