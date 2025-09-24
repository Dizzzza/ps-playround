import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Task,
  TaskDocument,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilter,
} from './app.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  // Find all tasks
  async findAll(filter: TaskFilter = {}): Promise<Task[]> {
    const { completed, priority, search } = filter;
    const query: Record<string, any> = {};

    if (completed !== undefined) query.completed = completed;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await this.taskModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({ id_: id }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const task = new this.taskModel({ ...input, completed: false });
    task.id_ = uuidv4();
    return task.save();
  }

  async update(input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { id_: input.id },
        { ...input, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      .exec();

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string): Promise<Task> {
    const task = await this.taskModel.findOneAndDelete({ id_: id }).exec();

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
