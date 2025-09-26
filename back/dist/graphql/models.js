var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Connection, Document, Model } from 'mongoose';
export var Priority;
(function (Priority) {
  Priority['LOW'] = 'LOW';
  Priority['MEDIUM'] = 'MEDIUM';
  Priority['HIGH'] = 'HIGH';
  Priority['CRITICAL'] = 'CRITICAL';
})(Priority || (Priority = {}));
let Task = class Task {};
__decorate(
  [prop({ required: true, type: () => String }), __metadata('design:type', String)],
  Task.prototype,
  'title',
  void 0,
);
__decorate(
  [prop({ type: () => String }), __metadata('design:type', String)],
  Task.prototype,
  'description',
  void 0,
);
__decorate(
  [
    prop({ type: () => String, enum: Priority, default: Priority.MEDIUM }),
    __metadata('design:type', String),
  ],
  Task.prototype,
  'priority',
  void 0,
);
__decorate(
  [prop({ default: false, type: () => Boolean }), __metadata('design:type', Boolean)],
  Task.prototype,
  'completed',
  void 0,
);
Task = __decorate([modelOptions({ schemaOptions: { timestamps: true } })], Task);
export { Task };
export function createTaskModel(connection) {
  return getModelForClass(Task, {
    existingConnection: connection,
  });
}
//# sourceMappingURL=models.js.map
