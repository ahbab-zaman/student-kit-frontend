import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Filter,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const priorities = ["low", "medium", "high"];
  const statuses = ["todo", "in_progress", "completed"];

  useEffect(() => {
    setTimeout(() => {
      setTasks([
        {
          id: "1",
          title: "Finish project",
          description: "Complete the final report for the science project",
          priority: "high",
          due_date: "2025-09-05",
          status: "todo",
        },
      ]);
      setFilteredTasks([
        {
          id: "1",
          title: "Finish project",
          description: "Complete the final report for the science project",
          priority: "high",
          due_date: "2025-09-05",
          status: "todo",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let updatedTasks = [...tasks];
    if (statusFilter !== "all") {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === statusFilter
      );
    }
    if (priorityFilter !== "all") {
      updatedTasks = updatedTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }
    setFilteredTasks(updatedTasks);
  }, [statusFilter, priorityFilter, tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      due_date: formData.get("due_date"),
      status: editingTask ? editingTask.status : "todo",
    };

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? taskData : task))
      );
      toast({ title: "Task updated successfully!" });
    } else {
      setTasks((prev) => [taskData, ...prev]);
      toast({ title: "Task added successfully!" });
    }

    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({ title: "Task deleted successfully!" });
  };

  const toggleTaskStatus = (id, currentStatus) => {
    const nextStatus =
      currentStatus === "todo"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "completed"
        : "todo";
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: nextStatus } : task
      )
    );
    toast({ title: `Task marked as ${nextStatus}!` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">To-Do List</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </div>
        <div className="flex space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] border-border/40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] border-border/40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card">
              <DialogHeader>
                <DialogTitle className="gradient-text">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </DialogTitle>
                <DialogDescription>
                  Create or edit a task with details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Finish project"
                    defaultValue={editingTask?.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the task"
                    defaultValue={editingTask?.description}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      name="priority"
                      defaultValue={editingTask?.priority || "medium"}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      name="due_date"
                      type="date"
                      defaultValue={editingTask?.due_date}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full btn-gradient">
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="gradient-text">Your Tasks</CardTitle>
          <CardDescription>{filteredTasks.length} tasks found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg border border-border/40 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                >
                  {task.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--color-science))]" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <div>
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1).replace("_", " ")}
                    </span>
                    <span>|</span>
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    <span>|</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === "high"
                          ? "bg-[hsl(var(--color-math))]/10 text-[hsl(var(--color-math))]"
                          : task.priority === "medium"
                          ? "bg-[hsl(var(--color-history))]/10 text-[hsl(var(--color-history))]"
                          : "bg-[hsl(var(--color-science))]/10 text-[hsl(var(--color-science))]"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTask(task);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No tasks found. Add a new task to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Todo;
