import { gql } from 'graphql-request';

export const GET_TASKS = gql`
  query TaskMany {
    taskMany {
      title
      description
      priority
      completed
      _id
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query TaskById($_id: MongoID!) {
    taskById(_id: $_id) {
      title
      description
      priority
      completed
      _id
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation TaskCreate($record: CreateOneTaskInput!) {
    taskCreate(record: $record) {
      recordId
      record {
        title
        description
        priority
        completed
        _id
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation TaskUpdateById($_id: MongoID!, $record: UpdateByIdTaskInput!) {
    taskUpdateById(_id: $_id, record: $record) {
      recordId
      record {
        title
        description
        priority
        completed
        _id
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation TaskRemoveById($_id: MongoID!) {
    taskRemoveById(_id: $_id) {
      recordId
      record {
        title
        description
        priority
        completed
        _id
        createdAt
        updatedAt
      }
    }
  }
`;
