import { graphQLClient } from "../graphql-client";
import { Task, TaskInput } from "../graphql-client";
import {
  GET_TASKS,
  GET_TASK,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  DELETE_COMPLETED_TASKS,
} from "../graphql/queries";

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    try {
      const data = await graphQLClient.request<{ tasks: Task[] }>(GET_TASKS);
      return data.tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  static async getTask(id: string): Promise<Task | null> {
    try {
      const data = await graphQLClient.request<{ task: Task }>(GET_TASK, {
        id,
      });
      return data.task;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  }

  static async createTask(input: TaskInput): Promise<Task> {
    try {
      const data = await graphQLClient.request<{ createTask: Task }>(
        CREATE_TASK,
        { input }
      );
      return data.createTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  static async updateTask(
    id: string,
    updates: Partial<{
      completed: boolean;
      title: string;
      description: string;
      priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    }>
  ): Promise<Task> {
    try {
      const data = await graphQLClient.request<{ updateTask: Task }>(
        UPDATE_TASK,
        {
          id,
          ...updates,
        }
      );
      return data.updateTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  static async deleteTask(id: string): Promise<boolean> {
    try {
      const data = await graphQLClient.request<{ deleteTask: boolean }>(
        DELETE_TASK,
        { id }
      );
      return data.deleteTask;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  static async deleteCompletedTasks(): Promise<number> {
    try {
      const data = await graphQLClient.request<{
        deleteCompletedTasks: number;
      }>(DELETE_COMPLETED_TASKS);
      return data.deleteCompletedTasks;
    } catch (error) {
      console.error("Error deleting completed tasks:", error);
      throw error;
    }
  }
}
