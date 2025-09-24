import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AppService } from './app.service';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilter,
} from './app.schema';

@Resolver(() => Task)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => [Task], { name: 'tasks' })
  findAll(@Args('filter', { nullable: true }) filter?: TaskFilter) {
    return this.appService.findAll(filter);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.appService.findOne(id);
  }

  @Mutation(() => Task)
  createTask(@Args('input') input: CreateTaskInput) {
    return this.appService.create(input);
  }

  @Mutation(() => Task)
  updateTask(@Args('input') input: UpdateTaskInput) {
    return this.appService.update(input);
  }

  @Mutation(() => Task)
  deleteTask(@Args('id', { type: () => ID }) id: string) {
    return this.appService.remove(id);
  }
}
