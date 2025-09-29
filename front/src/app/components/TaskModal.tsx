import { Modal, Form, Input, Select, Button, Space } from 'antd';
import { TaskManyQuery } from '../lib/tasks/tasks.generated';
import { CreateOneTaskInput, UpdateByIdTaskInput } from '@/types';

interface TaskModalProps {
  visible: boolean;
  editingTask: TaskManyQuery['taskMany'][number] | null;
  onCancel: () => void;
  onSubmit: (values: Partial<UpdateByIdTaskInput | CreateOneTaskInput>) => void;
}

const { Option } = Select;
const { TextArea } = Input;

export function TaskModal({ visible, editingTask, onCancel, onSubmit }: TaskModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: Partial<UpdateByIdTaskInput | CreateOneTaskInput>) => {
    await onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingTask ? 'Редактировать задачу' : 'Создать задачу'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ priority: 'MEDIUM' }}
      >
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: 'Введите заголовок задачи' }]}
        >
          <Input placeholder="Введите заголовок задачи" />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <TextArea rows={4} placeholder="Введите описание задачи (необязательно)" />
        </Form.Item>

        <Form.Item name="priority" label="Приоритет">
          <Select>
            <Option value="LOW">Низкий</Option>
            <Option value="MEDIUM">Средний</Option>
            <Option value="HIGH">Высокий</Option>
            <Option value="CRITICAL">Срочный</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Обновить' : 'Создать'}
            </Button>
            <Button onClick={handleCancel}>Отмена</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
