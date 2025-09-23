import { gql } from "graphql-request";

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      completed
      createdAt
      priority
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      completed
      createdAt
      priority
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      completed
      createdAt
      priority
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $completed: Boolean
    $title: String
    $description: String
    $priority: Priority
  ) {
    updateTask(
      id: $id
      completed: $completed
      title: $title
      description: $description
      priority: $priority
    ) {
      id
      title
      description
      completed
      createdAt
      priority
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const DELETE_COMPLETED_TASKS = gql`
  mutation DeleteCompletedTasks {
    deleteCompletedTasks
  }
`;
