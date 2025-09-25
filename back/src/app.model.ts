import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Connection, Document, Model } from 'mongoose';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Task {
  @prop({ required: true })
  title: string;

  @prop()
  description?: string;

  @prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @prop({ default: false })
  completed: boolean;
}

export function createTaskModel(connection: Connection) {
  return getModelForClass(Task, {
    existingConnection: connection,
  }) as unknown as Model<Task & Document>;
}
