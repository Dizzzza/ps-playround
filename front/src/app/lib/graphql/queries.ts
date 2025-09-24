import { gql } from "graphql-request";

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      completed
      createdAt
      description
      id_
      priority
      title
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      completed
      createdAt
      description
      id_
      priority
      title
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      completed
      createdAt
      description
      id_
      priority
      title
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      completed
      createdAt
      description
      id_
      priority
      title
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      completed
      createdAt
      description
      id_
      priority
      title
      updatedAt
    }
  }
`;
