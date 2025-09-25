import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { buildGraphqlSchema } from './app.graphql';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, MongooseModule],
      inject: [ConfigService, getConnectionToken()],
      useFactory: (configService: ConfigService, connection: Connection) => ({
        sortSchema: true,
        schema: buildGraphqlSchema(connection),
        path: configService.get<string>('GRAPHQL_PATH') || '/graphql',
        playground: configService.get<boolean>('GRAPHQL_PLAYGROUND') ?? true,
        introspection: configService.get<boolean>('GRAPHQL_INTROSPECTION') ?? true,
      }),
    }),
  ],
})
export class AppModule {}
