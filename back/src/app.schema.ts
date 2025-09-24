import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, InputType, ID, PartialType, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Schema({ timestamps: true })
@ObjectType()
export class Task extends Document {
  @Field(() => ID)
  @Prop({ required: true, unique: true })
  id_: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop()
  @Field({ nullable: true })
  description?: string;

  @Prop({ type: String, enum: Priority, default: Priority.MEDIUM })
  @Field()
  priority: Priority;

  @Prop({ default: false })
  @Field()
  completed: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type TaskDocument = Task & Document;

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  priority?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  priority?: string;

  @Field({ nullable: true })
  completed?: boolean;
}

@InputType()
export class TaskFilter {
  @Field({ nullable: true })
  completed?: boolean;

  @Field(() => String, { nullable: true })
  priority?: Priority;

  @Field({ nullable: true })
  search?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
