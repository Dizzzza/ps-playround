import { GraphQLClient } from "graphql-request";

const graphqlAPI =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

export const graphQLClient = new GraphQLClient(graphqlAPI);

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface TaskInput {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}
