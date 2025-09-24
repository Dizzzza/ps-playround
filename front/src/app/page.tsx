"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Card,
  Tag,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Task, TaskInput } from "./lib/graphql-client";
import { TaskService } from "./lib/services/TaskService";

const { Option } = Select;
const { TextArea } = Input;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      message.error("Ошибка при загрузке задач");
    } finally {
      console.log(tasks);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTask) {
        values.id = editingTask.id; // <-- id, а не id_
        await TaskService.updateTask(values);
        message.success("Задача обновлена");
      } else {
        const taskInput: TaskInput = {
          title: values.title,
          description: values.description,
          priority: values.priority,
        };
        await TaskService.createTask(taskInput);
        message.success("Задача создана");
      }
      setModalVisible(false);
      form.resetFields();
      loadTasks();
    } catch (error) {
      message.error("Ошибка при сохранении задачи");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await TaskService.deleteTask(id);
      message.success("Задача удалена");
      loadTasks();
    } catch (error) {
      message.error("Ошибка при удалении задачи");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await TaskService.updateTask({
        id: task.id, // <-- id, а не id_
        completed: !task.completed, // только если добавим completed в UpdateTaskInput
      });
      message.success(
        `Задача отмечена как ${
          task.completed ? "незавершенная" : "завершенная"
        }`
      );
      loadTasks();
    } catch (error) {
      message.error("Ошибка при обновлении задачи");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "blue";
      case "MEDIUM":
        return "orange";
      case "HIGH":
        return "red";
      case "CRITICAL":
        return "purple";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Статус",
      dataIndex: "completed",
      key: "completed",
      width: 100,
      render: (completed: boolean, record: Task) => (
        <Switch
          checked={completed}
          onChange={() => handleToggleComplete(record)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
    },
    {
      title: "Заголовок",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Приоритет",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("ru-RU"),
    },
    {
      title: "Действия",
      key: "actions",
      width: 150,
      render: (_: any, record: Task) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить задачу?"
            description="Вы уверены, что хотите удалить эту задачу?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Менеджер задач</h1>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Создать задачу
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingTask ? "Редактировать задачу" : "Создать задачу"}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ priority: "MEDIUM" }}
          >
            <Form.Item
              name="title"
              label="Заголовок"
              rules={[{ required: true, message: "Введите заголовок задачи" }]}
            >
              <Input placeholder="Введите заголовок задачи" />
            </Form.Item>

            <Form.Item name="description" label="Описание">
              <TextArea
                rows={4}
                placeholder="Введите описание задачи (необязательно)"
              />
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
                  {editingTask ? "Обновить" : "Создать"}
                </Button>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Отмена
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
