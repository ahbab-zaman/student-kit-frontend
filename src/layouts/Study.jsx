import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, CheckCircle, Clock, Target } from "lucide-react";
import { toast } from "sonner";

const Study = () => {
  const [tasks, setTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTasks([
        {
          id: "1",
          subject: "Mathematics",
          topic: "Calculus",
          priority: "high",
          deadline: "2025-09-10",
          time_slot: "2 hours",
          status: "todo",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      id: Date.now().toString(),
      subject: formData.get("subject"),
      topic: formData.get("topic"),
      priority: formData.get("priority"),
      deadline: formData.get("deadline"),
      time_slot: formData.get("time_slot"),
      status: "todo",
    };

    setTasks((prev) => [taskData, ...prev]);
    toast({ title: "Study task added successfully!" });
    setIsDialogOpen(false);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    {
      title: "To Do",
      status: "todo",
      icon: Target,
      color: "border-blue-500/20",
    },
    {
      title: "In Progress",
      status: "in_progress",
      icon: Clock,
      color: "border-yellow-500/20",
    },
    {
      title: "Completed",
      status: "completed",
      icon: CheckCircle,
      color: "border-green-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center lg:flex-row flex-col lg:text-left text-center gap-3">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Study Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Organize your study sessions and track progress
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Study Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
            <DialogHeader>
              <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Add Study Task
              </CardTitle>
              <DialogDescription>
                Create a new study session task
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g., Calculus basics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_slot">Time Slot</Label>
                <Input
                  id="time_slot"
                  name="time_slot"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                Add Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {columns.map((column) => (
          <Card
            key={column.status}
            className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${column.color}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                <column.icon className="h-5 w-5" />
                <span>{column.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({getTasksByStatus(column.status).length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTasksByStatus(column.status).map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div>
                    <h4 className="font-semibold">{task.subject}</h4>
                    {task.topic && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.topic}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500/10 text-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {task.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            task.status === "todo" ? "in_progress" : "completed"
                          )
                        }
                        className="flex-1 border-gray-200 dark:border-gray-700"
                      >
                        {task.status === "todo" ? "Start" : "Complete"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {getTasksByStatus(column.status).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No tasks
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Study;
