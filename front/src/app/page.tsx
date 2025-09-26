'use client';

import { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { Task, TaskInput } from './types/taskTypes';
import { TaskService } from './lib/services/TaskService';
import { TaskTable } from './components/TaskTable';
import { TaskModal } from './components/TaskModal';
import { PageHeader } from './components/Header';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData);
    } catch {
      message.error('Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSubmit = async (values: Partial<TaskInput>) => {
    try {
      if (editingTask) {
        await TaskService.updateTask(editingTask._id, values);
        message.success('Задача обновлена');
      } else {
        const taskInput: TaskInput = {
          title: values.title!,
          description: values.description,
          priority: values.priority!,
        };
        await TaskService.createTask(taskInput);
        message.success('Задача создана');
      }
      setModalVisible(false);
      loadTasks();
    } catch {
      message.error('Ошибка при сохранении задачи');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      message.success('Задача удалена');
      loadTasks();
    } catch {
      message.error('Ошибка при удалении задачи');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await TaskService.updateTask(task._id, {
        completed: !task.completed,
      });
      message.success(`Задача отмечена как ${task.completed ? 'незавершенная' : 'завершенная'}`);
      loadTasks();
    } catch {
      message.error('Ошибка при обновлении задачи');
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader onCreate={handleCreate} />

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
