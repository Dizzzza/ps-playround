import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { createTaskModel } from './app.model';
import { Connection } from 'mongoose';

export function buildGraphqlSchema(connection: Connection) {
  const TaskModel = createTaskModel(connection); // создаём модель на коннекте NestJS
  const TaskTC = composeMongoose(TaskModel);

  schemaComposer.Query.addFields({
    taskById: TaskTC.mongooseResolvers.findById(),
    taskByIds: TaskTC.mongooseResolvers.findByIds(),
    taskOne: TaskTC.mongooseResolvers.findOne(),
    taskMany: TaskTC.mongooseResolvers.findMany(),
    taskCount: TaskTC.mongooseResolvers.count(),
    taskPagination: TaskTC.mongooseResolvers.pagination(),
  });

  schemaComposer.Mutation.addFields({
    taskCreate: TaskTC.mongooseResolvers.createOne(),
    taskCreateMany: TaskTC.mongooseResolvers.createMany(),
    taskUpdateById: TaskTC.mongooseResolvers.updateById(),
    taskUpdateOne: TaskTC.mongooseResolvers.updateOne(),
    taskUpdateMany: TaskTC.mongooseResolvers.updateMany(),
    taskRemoveById: TaskTC.mongooseResolvers.removeById(),
    taskRemoveOne: TaskTC.mongooseResolvers.removeOne(),
    taskRemoveMany: TaskTC.mongooseResolvers.removeMany(),
  });

  return schemaComposer.buildSchema();
}
