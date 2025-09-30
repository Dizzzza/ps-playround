import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { createTaskModel } from './models.js';
import type { Connection } from 'mongoose';

export function buildGraphqlSchema(connection: Connection) {
  const TaskModel = createTaskModel(connection);

  const TaskTC = composeMongoose(TaskModel, {});

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

  const DeleteCompletedInputTC = schemaComposer.createInputTC({
    name: 'DeleteCompletedInput',
    fields: {
      limit: 'Int!',
    },
  });

  const DeleteCompletedResponseTC = schemaComposer.createObjectTC({
    name: 'DeleteCompletedResponse',
    fields: {
      count: 'Int!',
      tasks: [TaskTC],
    },
  });

  schemaComposer.Mutation.addFields({
    deleteCompletedTasks: {
      args: {
        input: DeleteCompletedInputTC,
      },
      type: DeleteCompletedResponseTC,
      resolve: async (_: unknown, { input }: { input: { limit: number } }) => {
        const tasks = await TaskModel.find({ completed: true }).limit(input.limit).exec();

        if (tasks.length === 0) {
          return { count: 0, tasks: [] };
        }

        const ids = tasks.map((t) => t._id);
        const result = await TaskModel.deleteMany({ _id: { $in: ids } });

        return {
          count: result.deletedCount || 0,
          tasks,
        };
      },
    },
  });

  return schemaComposer.buildSchema();
}
