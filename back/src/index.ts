// server.ts
import 'dotenv/config'; // Загружает .env
import express, { type Application } from 'express';
import mongoose, { type Connection } from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildGraphqlSchema } from './graphql/resolvers.js';
import bodyParser from 'body-parser';
import cors from 'cors';

async function startServer() {
  const app: Application = express();

  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsCredentials = process.env.CORS_CREDENTIALS === 'true';
  app.use(cors({ origin: corsOrigin, credentials: corsCredentials }));

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  const mongoConnection: Connection = await mongoose
    .createConnection(mongoUri, { retryWrites: true })
    .asPromise();

  console.log('✅ MongoDB connected');

  const schema = buildGraphqlSchema(mongoConnection);

  const server = new ApolloServer({
    schema,
    introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
  });

  await server.start();

  app.use(
    process.env.GRAPHQL_PATH || '/graphql',
    cors({ origin: corsOrigin, credentials: corsCredentials }),
    bodyParser.json(),
    expressMiddleware(server),
  );

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(
      `🚀 Server running on http://localhost:${port}${process.env.GRAPHQL_PATH || '/graphql'}`,
    );
  });
}

startServer().catch((err) => {
  console.error('❌ Error starting server:', err);
});
