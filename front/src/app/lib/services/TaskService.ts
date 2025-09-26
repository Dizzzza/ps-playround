import { graphQLClient } from '../graphql-client';
import { Task, TaskInput } from '../../types/taskTypes';
import { GET_TASKS, GET_TASK, CREATE_TASK, UPDATE_TASK, DELETE_TASK } from '../graphql/queries';

export class TaskService {
  // Получение всех задач
  static async getTasks(): Promise<Task[]> {
    try {
      const data = await graphQLClient.request<{ taskMany: Task[] }>(GET_TASKS);
      return data.taskMany;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Получение задачи по ID
  static async getTask(id: string): Promise<Task | null> {
    try {
      const data = await graphQLClient.request<{ taskById: Task | null }>(GET_TASK, { id });
      return data.taskById;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Создание новой задачи
  static async createTask(input: TaskInput): Promise<Task> {
    try {
      const data = await graphQLClient.request<{ taskCreate: { record: Task } }>(CREATE_TASK, {
        record: input,
      });
      return data.taskCreate.record;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Обновление задачи
  static async updateTask(_id: string, record: Partial<TaskInput>): Promise<Task> {
    try {
      const data = await graphQLClient.request<{
        taskUpdateById: { _id: string; record: Task };
      }>(UPDATE_TASK, { _id, record });
      return data.taskUpdateById.record;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Удаление задачи
  static async deleteTask(_id: string): Promise<boolean> {
    try {
      const data = await graphQLClient.request<{
        taskRemoveById: { record: Task | null };
      }>(DELETE_TASK, { _id });
      return !!data.taskRemoveById.record;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}
