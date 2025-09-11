// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Plus,
//   CheckCircle,
//   Circle,
//   Clock,
//   Calendar,
//   Trash2,
//   Edit,
// } from "lucide-react";
// import { toast } from "sonner";
// import useTaskStore from "../hooks/useTodo"; // Adjust path based on your project structure

// const Todo = () => {
//   const {
//     tasks,
//     filteredTasks,
//     loading,
//     fetchTasks,
//     addTask,
//     updateTask,
//     deleteTask,
//     setFilteredTasks,
//   } = useTaskStore();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [priorityFilter, setPriorityFilter] = useState("all");

//   const priorities = ["low", "medium", "high"];
//   const statuses = ["todo", "in_progress", "completed"];

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   useEffect(() => {
//     let updatedTasks = [...tasks];
//     if (statusFilter !== "all") {
//       updatedTasks = updatedTasks.filter(
//         (task) => task.status === statusFilter
//       );
//     }
//     if (priorityFilter !== "all") {
//       updatedTasks = updatedTasks.filter(
//         (task) => task.priority === priorityFilter
//       );
//     }
//     setFilteredTasks(updatedTasks);
//   }, [statusFilter, priorityFilter, tasks, setFilteredTasks]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const taskData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       priority: formData.get("priority"),
//       due_date: formData.get("due_date"),
//       status: formData.get("status"),
//     };

//     if (editingTask) {
//       await updateTask(editingTask.id, taskData);
//     } else {
//       await addTask(taskData);
//     }

//     setIsDialogOpen(false);
//     setEditingTask(null);
//   };

//   const toggleTaskStatus = async (id, currentStatus) => {
//     const nextStatus =
//       currentStatus === "todo"
//         ? "in_progress"
//         : currentStatus === "in_progress"
//         ? "completed"
//         : "todo";
//     await updateTask(id, { status: nextStatus });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in slide-in-from-top duration-500">
//       {/* Header + Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//         <div className="text-center md:text-left">
//           <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
//             To-Do List
//           </h1>
//           <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
//             Manage your tasks efficiently
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-full sm:w-[140px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all" className="text-sm sm:text-base">
//                 All Statuses
//               </SelectItem>
//               {statuses.map((status) => (
//                 <SelectItem
//                   key={status}
//                   value={status}
//                   className="text-sm sm:text-base"
//                 >
//                   {status.charAt(0).toUpperCase() +
//                     status.slice(1).replace("_", " ")}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//             <SelectTrigger className="w-full sm:w-[140px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
//               <SelectValue placeholder="Filter by priority" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all" className="text-sm sm:text-base">
//                 All Priorities
//               </SelectItem>
//               {priorities.map((priority) => (
//                 <SelectItem
//                   key={priority}
//                   value={priority}
//                   className="text-sm sm:text-base"
//                 >
//                   {priority.charAt(0).toUpperCase() + priority.slice(1)}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300 w-full sm:w-auto">
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Task
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
//               <DialogHeader>
//                 <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//                   {editingTask ? "Edit Task" : "Add New Task"}
//                 </DialogTitle>
//                 <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//                   Create or edit a task with details
//                 </DialogDescription>
//               </DialogHeader>
//               <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//                 <div className="space-y-2">
//                   <Label htmlFor="title" className="text-sm font-medium">
//                     Title
//                   </Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     placeholder="e.g., Finish project"
//                     defaultValue={editingTask?.title}
//                     required
//                     className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description" className="text-sm font-medium">
//                     Description
//                   </Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     placeholder="Brief description of the task"
//                     defaultValue={editingTask?.description}
//                     className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="priority" className="text-sm font-medium">
//                       Priority
//                     </Label>
//                     <Select
//                       name="priority"
//                       defaultValue={editingTask?.priority || "medium"}
//                       required
//                     >
//                       <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
//                         <SelectValue placeholder="Select priority" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//                         {priorities.map((priority) => (
//                           <SelectItem
//                             key={priority}
//                             value={priority}
//                             className="text-sm sm:text-base"
//                           >
//                             {priority.charAt(0).toUpperCase() +
//                               priority.slice(1)}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="due_date" className="text-sm font-medium">
//                       Due Date
//                     </Label>
//                     <Input
//                       id="due_date"
//                       name="due_date"
//                       type="date"
//                       defaultValue={editingTask?.due_date}
//                       required
//                       className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="status" className="text-sm font-medium">
//                     Status
//                   </Label>
//                   <Select
//                     name="status"
//                     defaultValue={editingTask?.status || "todo"}
//                     required
//                   >
//                     <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//                       {statuses.map((status) => (
//                         <SelectItem
//                           key={status}
//                           value={status}
//                           className="text-sm sm:text-base"
//                         >
//                           {status.charAt(0).toUpperCase() +
//                             status.slice(1).replace("_", " ")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
//                 >
//                   {editingTask ? "Update Task" : "Add Task"}
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Task List */}
//       <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//             Your Tasks
//           </CardTitle>
//           <CardDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
//             {filteredTasks.length} tasks found
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {filteredTasks.map((task) => (
//             <div
//               key={task.id}
//               className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
//             >
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div className="flex items-start sm:items-center gap-3 flex-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => toggleTaskStatus(task.id, task.status)}
//                     className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                   >
//                     {task.status === "completed" ? (
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                     ) : (
//                       <Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                     )}
//                   </Button>
//                   <div className="min-w-0">
//                     <p className="font-semibold text-base break-words">
//                       {task.title}
//                     </p>
//                     {task.description && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
//                         {task.description}
//                       </p>
//                     )}
//                     <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
//                       <Clock className="h-4 w-4" />
//                       <span>
//                         {task.status.charAt(0).toUpperCase() +
//                           task.status.slice(1).replace("_", " ")}
//                       </span>
//                       <span>|</span>
//                       <Calendar className="h-4 w-4" />
//                       <span>
//                         {new Date(task.due_date).toLocaleDateString()}
//                       </span>
//                       <span>|</span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           task.priority === "high"
//                             ? "bg-red-500/10 text-red-500"
//                             : task.priority === "medium"
//                             ? "bg-yellow-500/10 text-yellow-500"
//                             : "bg-green-500/10 text-green-500"
//                         }`}
//                       >
//                         {task.priority}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 self-end sm:self-auto">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setEditingTask(task);
//                       setIsDialogOpen(true);
//                     }}
//                     className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                   >
//                     <Edit className="h-5 w-5 text-gray-500 dark:text-gray-300" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => deleteTask(task.id)}
//                     className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                   >
//                     <Trash2 className="h-5 w-5 text-red-500" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {filteredTasks.length === 0 && (
//             <div className="text-center text-gray-500 dark:text-gray-400 py-8">
//               No tasks found. Add a new task to get started!
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Todo;

import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Plus,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Trash2,
  Edit,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";
import useTaskStore from "../hooks/useTodo";
import { DialogTrigger } from "@radix-ui/react-dialog";

const Todo = () => {
  const {
    tasks,
    filteredTasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    setFilteredTasks,
  } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const priorities = ["low", "medium", "high"];
  const statuses = ["todo", "in_progress", "completed"];

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
  }, [statusFilter, priorityFilter, tasks, setFilteredTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      due_date: formData.get("due_date"),
      status: formData.get("status"),
    };

    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }

    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === "todo"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "completed"
        : "todo";
    await updateTask(id, { status: nextStatus });
  };

  const openDetailsDialog = (task) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in slide-in-from-top duration-500">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
            To-Do List
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage your tasks efficiently
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-sm sm:text-base">
                All Statuses
              </SelectItem>
              {statuses.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="text-sm sm:text-base"
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[140px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-sm sm:text-base">
                All Priorities
              </SelectItem>
              {priorities.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="text-sm sm:text-base"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300 w-full sm:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Create or edit a task with details
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Finish project"
                    defaultValue={editingTask?.title}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the task"
                    defaultValue={editingTask?.description}
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </Label>
                    <Select
                      name="priority"
                      defaultValue={editingTask?.priority || "medium"}
                      required
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {priorities.map((priority) => (
                          <SelectItem
                            key={priority}
                            value={priority}
                            className="text-sm sm:text-base"
                          >
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-sm font-medium">
                      Due Date
                    </Label>
                    <Input
                      id="due_date"
                      name="due_date"
                      type="date"
                      defaultValue={editingTask?.due_date}
                      required
                      className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    name="status"
                    defaultValue={editingTask?.status || "todo"}
                    required
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 text-sm sm:text-base">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {statuses.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-sm sm:text-base"
                        >
                          {status.charAt(0).toUpperCase() +
                            status.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Task List */}
      <Card className="shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your Tasks
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {filteredTasks.length} tasks found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </Button>
                  <div className="min-w-0">
                    <p className="font-semibold text-base break-words">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1).replace("_", " ")}
                      </span>
                      <span>|</span>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                      <span>|</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === "high"
                            ? "bg-red-500/10 text-red-500"
                            : task.priority === "medium"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDetailsDialog(task)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Eye className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTask(task);
                      setIsDialogOpen(true);
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Edit className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks found. Add a new task to get started!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {selectedTask && (
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {selectedTask.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Task Details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="font-semibold">Description:</span>
                {selectedTask.description || "No description provided"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedTask.status.charAt(0).toUpperCase() +
                    selectedTask.status.slice(1).replace("_", " ")}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {new Date(selectedTask.due_date).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span className="font-semibold">Priority:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedTask.priority === "high"
                      ? "bg-red-500/10 text-red-500"
                      : selectedTask.priority === "medium"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {selectedTask.priority}
                </span>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Todo;
