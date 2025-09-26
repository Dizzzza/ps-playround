import { Table, Switch, Button, Space, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Task } from '../types/taskTypes';
import { getPriorityColor } from '../utils/getPriorityColor';

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const columns = [
    {
      title: 'Статус',
      dataIndex: 'completed',
      key: 'completed',
      width: 100,
      render: (completed: boolean, record: Task) => (
        <Switch
          checked={completed}
          onChange={() => onToggleComplete(record)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('ru-RU'),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: number, record: Task) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Редактировать
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(record._id)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};
