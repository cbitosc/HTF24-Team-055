import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

// Define the type for a Task
interface Task {
  _id: string; // Adjust the type as necessary (e.g., number, ObjectId)
  title: string;
  description?: string; // New description field
  status: "planned" | "ongoing" | "completed"; // Define valid statuses
}

const TaskCard = ({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ title, description, status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // If the update is successful, call the onUpdate callback
      onUpdate({ ...task, title, description, status });
      onOpenChange();
    } catch (error) {
      console.error(error);
      // Handle the error (e.g., show a notification)
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // If the delete is successful, call the onDelete callback
      onDelete(task._id);
      onOpenChange();
    } catch (error) {
      console.error(error);
      // Handle the error (e.g., show a notification)
    }
  };
  return (
    <>
      <div
        className="p-4 rounded-lg shadow-md mb-4 cursor-pointer border"
        onClick={onOpen}
      >
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-gray-500 overflow-hidden">{description}</p>
        <p className="text-gray-400">Status: {status}</p>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Task
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task["status"])}
                  className="mt-2 block w-full border rounded p-2"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    handleDelete();
                    onDelete(task._id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
                <Button color="primary" onPress={handleUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const TaskColumn = ({
  title,
  tasks,
  onUpdate,
  onDelete,
}: {
  title: string;
  tasks: Task[];
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="w-[400px] p-4">
    <h2 className="font-semibold text-gray-600 mb-4">{title}</h2>
    {tasks.length === 0 ? (
      <p>No tasks available.</p>
    ) : (
      tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

export default function IndexPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tasks/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const taskGroups = {
    planned: tasks.filter((task) => task.status === "planned"),
    ongoing: tasks.filter((task) => task.status === "ongoing"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w text-center">
          <h1 className="text-2xl font-bold mb-6">Task Status Overview</h1>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">Please Login First</p>}
          <div className="flex justify-center">
            <TaskColumn
              title={`Planned (${taskGroups.planned.length})`}
              tasks={taskGroups.planned}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title={`Ongoing (${taskGroups.ongoing.length})`}
              tasks={taskGroups.ongoing}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title={`Completed (${taskGroups.completed.length})`}
              tasks={taskGroups.completed}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
