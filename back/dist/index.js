// server.ts
import 'dotenv/config'; // Загружает .env
import express from 'express';
import mongoose, { Connection } from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { buildGraphqlSchema } from './graphql/resolvers.js';
import bodyParser from 'body-parser';
import cors from 'cors';
async function startServer() {
  const app = express();
  // Mongo
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  const mongoConnection = await mongoose
    .createConnection(mongoUri, { retryWrites: true })
    .asPromise();
  console.log('✅ MongoDB connected');
  const schema = buildGraphqlSchema(mongoConnection);
  // Apollo Server
  const server = new ApolloServer({
    schema,
    introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
  });
  await server.start();
  // CORS
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsCredentials = process.env.CORS_CREDENTIALS === 'true';
  app.use(cors({ origin: corsOrigin, credentials: corsCredentials }));
  app.use(bodyParser.json());
  // Apollo middleware
  server.applyMiddleware({
    app,
    path: process.env.GRAPHQL_PATH || '/graphql',
  });
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}${server.graphqlPath}`);
  });
}
startServer().catch((err) => {
  console.error('❌ Error starting server:', err);
});
//# sourceMappingURL=index.js.map
