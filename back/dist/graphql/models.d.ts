import { Connection, Document, Model } from 'mongoose';
export declare enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
export declare class Task {
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
}
export declare function createTaskModel(connection: Connection): Model<Task & Document>;
//# sourceMappingURL=models.d.ts.map
