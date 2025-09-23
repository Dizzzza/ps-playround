require("dotenv").config(); // Добавляем в самом начале файла
const { ApolloServer, gql } = require("apollo-server");
const { v4: uuidv4 } = require("uuid");

// Хранилище задач в памяти (Map)
const tasksMap = new Map();

// Схема GraphQL
const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    createdAt: String!
    priority: Priority!
  }

  input TaskInput {
    title: String!
    description: String
    priority: Priority = MEDIUM
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByStatus(completed: Boolean!): [Task!]!
    tasksByPriority(priority: Priority!): [Task!]!
  }

  type Mutation {
    createTask(input: TaskInput!): Task!
    updateTask(
      id: ID!
      completed: Boolean
      title: String
      description: String
      priority: Priority
    ): Task!
    deleteTask(id: ID!): Boolean!
    deleteCompletedTasks: Int!
  }

  type Subscription {
    taskCreated: Task!
    taskUpdated: Task!
    taskDeleted: ID!
  }
`;

// Резолверы
const resolvers = {
  Query: {
    tasks: () => {
      return Array.from(tasksMap.values()).map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt).toISOString(),
      }));
    },

    task: (_, { id }) => {
      const task = tasksMap.get(id);
      if (task) {
        return {
          ...task,
          createdAt: new Date(task.createdAt).toISOString(),
        };
      }
      return null;
    },

    tasksByStatus: (_, { completed }) => {
      return Array.from(tasksMap.values())
        .filter((task) => task.completed === completed)
        .map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt).toISOString(),
        }));
    },

    tasksByPriority: (_, { priority }) => {
      return Array.from(tasksMap.values())
        .filter((task) => task.priority === priority)
        .map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt).toISOString(),
        }));
    },
  },

  Mutation: {
    createTask: (_, { input }) => {
      const id = uuidv4();
      const newTask = {
        id,
        title: input.title,
        description: input.description || "",
        completed: false,
        priority: input.priority || "MEDIUM",
        createdAt: new Date().toISOString(),
      };

      tasksMap.set(id, newTask);

      // Эмуляция подписки (в реальном приложении нужно использовать PubSub)
      if (process.env.NODE_ENV === "development") {
        console.log("📝 Task created:", newTask.title);
      }

      return newTask;
    },

    updateTask: (_, { id, completed, title, description, priority }) => {
      const task = tasksMap.get(id);
      if (task) {
        if (completed !== undefined) task.completed = completed;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;

        tasksMap.set(id, task);

        if (process.env.NODE_ENV === "development") {
          console.log("✏️ Task updated:", task.title);
        }

        return {
          ...task,
          createdAt: new Date(task.createdAt).toISOString(),
        };
      }
      throw new Error("Task not found");
    },

    deleteTask: (_, { id }) => {
      const task = tasksMap.get(id);
      if (task) {
        tasksMap.delete(id);

        if (process.env.NODE_ENV === "development") {
          console.log("🗑️ Task deleted:", task.title);
        }

        return true;
      }
      return false;
    },

    deleteCompletedTasks: () => {
      let deletedCount = 0;
      for (let [id, task] of tasksMap) {
        if (task.completed) {
          tasksMap.delete(id);
          deletedCount++;
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`🗑️ Deleted ${deletedCount} completed tasks`);
      }

      return deletedCount;
    },
  },
};

// Конфигурация сервера из environment variables
const serverConfig = {
  typeDefs,
  resolvers,
  introspection: process.env.INTROSPECTION_ENABLED === "true",
  playground: process.env.PLAYGROUND_ENABLED === "true",
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: process.env.CORS_CREDENTIALS === "true",
  },
  context: ({ req }) => {
    // Можно добавить аутентификацию и другую логику контекста
    return {
      user: req.headers.user || "anonymous",
      timestamp: new Date().toISOString(),
    };
  },
};

// Создание и запуск сервера
const server = new ApolloServer(serverConfig);

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

server
  .listen({
    port: PORT,
    host: HOST,
  })
  .then(({ url }) => {
    console.log(
      `🚀 Server ${process.env.SERVER_NAME || "TaskManagerAPI"} ready at ${url}`
    );
    console.log(
      `📊 GraphQL Playground: ${url}${process.env.GRAPHQL_PATH || "/graphql"}`
    );
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📝 Loaded tasks: ${tasksMap.size}`);
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
  });
