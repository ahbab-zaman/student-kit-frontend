import { create } from "zustand";
import { toast } from "sonner";
import api from "../lib/axiosInstance"; // Adjust path based on your project structure

const useTaskStore = create((set) => ({
  tasks: [],
  filteredTasks: [],
  loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/todos");
      const data = response.data;
      if (data.success) {
        const tasks = data.data.map((task) => ({ ...task, id: task._id }));
        set({ tasks, filteredTasks: tasks });
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching tasks");
    } finally {
      set({ loading: false });
    }
  },
  addTask: async (taskData) => {
    try {
      const response = await api.post("/todos", taskData);
      const data = response.data;
      if (data.success) {
        const newTask = { ...data.data, id: data.data._id };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          filteredTasks: [newTask, ...state.filteredTasks],
        }));
        toast.success("Task added successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding task");
    }
  },
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/todos/${id}`, taskData);
      const data = response.data;
      if (data.success) {
        const updatedTask = { ...data.data, id: data.data._id };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
          filteredTasks: state.filteredTasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
        }));
        toast.success("Task updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating task");
    }
  },
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      const data = response.data;
      if (data.success) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          filteredTasks: state.filteredTasks.filter((task) => task.id !== id),
        }));
        toast.success("Task deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting task");
    }
  },
  setFilteredTasks: (filteredTasks) => set({ filteredTasks }),
}));

export default useTaskStore;
