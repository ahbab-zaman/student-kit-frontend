import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useScheduleStore } from "../hooks/useSchedule";
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
import {
  Plus,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Schedule = () => {
  const { classes, loading, fetchClasses, addClass, updateClass, deleteClass } =
    useScheduleStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const colors = [
    { name: "Blue", value: "#60A5FA" },
    { name: "Green", value: "#4ADE80" },
    { name: "Purple", value: "#A78BFA" },
    { name: "Yellow", value: "#FACC15" },
    { name: "Red", value: "#F87171" },
    { name: "Pink", value: "#F472B6" },
    { name: "Cyan", value: "#22D3EE" },
  ];

  // Dynamically get unique days from classes
  const availableDays = useMemo(() => {
    const days = [...new Set(classes.map((c) => c.day))].sort();
    return days.length > 0 ? days : ["Monday"];
  }, [classes]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Debounce search term
  const debouncedHandler = useMemo(
    () =>
      debounce((val) => {
        setDebouncedSearch(val.toLowerCase());
      }, 300),
    []
  );

  useEffect(() => {
    debouncedHandler(searchTerm);
    return () => debouncedHandler.cancel();
  }, [searchTerm, debouncedHandler]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const classData = {
      subject: formData.get("subject"),
      day: formData.get("day"),
      time_start: formData.get("time_start"),
      time_end: formData.get("time_end"),
      instructor: formData.get("instructor"),
      location: formData.get("location"),
      color: formData.get("color"),
    };

    if (editingClass) {
      updateClass(editingClass._id, classData);
      toast.success("Class updated successfully");
    } else {
      addClass(classData);
      toast.success("Class added successfully");
    }

    setIsDialogOpen(false);
    setEditingClass(null);
  };

  const handleDelete = async (id) => {
    console.log(`Initiating delete for class ID: ${id}`);
    toast.info("Are you sure you want to delete this class?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteClass(id);
            console.log(`Successfully deleted class ID: ${id}`);
            setSelectedClass(null);
          } catch (error) {
            console.error(`Failed to delete class ID: ${id}`, error);
            toast.error("Failed to delete class");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          console.log(`Delete cancelled for class ID: ${id}`);
          toast("Delete cancelled");
        },
      },
    });
  };

  const getClassesForDay = (day) => {
    return classes
      .filter((c) => c.day === day)
      .filter((c) => {
        if (!debouncedSearch) return true;
        return (
          c.subject.toLowerCase().includes(debouncedSearch) ||
          c.instructor.toLowerCase().includes(debouncedSearch) ||
          (c.location && c.location.toLowerCase().includes(debouncedSearch))
        );
      })
      .sort((a, b) => a.time_start.localeCompare(b.time_start));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in slide-in-from-top duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
            Class Schedule
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Organize and manage your weekly classes with ease
          </p>
        </div>

        {/* Search and Add Class */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative flex items-center w-full sm:w-64">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90vw] sm:max-w-lg md:max-w-xl rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingClass ? "Edit Class" : "Add New Class"}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Enter the details for your class below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Mathematics"
                    defaultValue={editingClass?.subject}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day" className="text-sm font-medium">
                      Day
                    </Label>
                    <Select
                      name="day"
                      defaultValue={editingClass?.day}
                      required
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {availableDays.map((day) => (
                          <SelectItem
                            key={day}
                            value={day}
                            className="text-sm sm:text-base"
                          >
                            {day}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="New Day"
                          className="text-sm sm:text-base"
                        >
                          New Day
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-medium">
                      Color
                    </Label>
                    <Select
                      name="color"
                      defaultValue={editingClass?.color || colors[0].value}
                      required
                    >
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {colors.map((color) => (
                          <SelectItem
                            key={color.value}
                            value={color.value}
                            className="text-sm sm:text-base"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time_start" className="text-sm font-medium">
                      Start Time
                    </Label>
                    <Input
                      id="time_start"
                      name="time_start"
                      type="time"
                      defaultValue={editingClass?.time_start}
                      required
                      className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time_end" className="text-sm font-medium">
                      End Time
                    </Label>
                    <Input
                      id="time_end"
                      name="time_end"
                      type="time"
                      defaultValue={editingClass?.time_end}
                      required
                      className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-sm font-medium">
                    Instructor
                  </Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    placeholder="e.g., Dr. Smith"
                    defaultValue={editingClass?.instructor}
                    required
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location (Optional)
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Room 101"
                    defaultValue={editingClass?.location}
                    className="border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg py-2 transition-all duration-300"
                >
                  {editingClass ? "Update Class" : "Add Class"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content with schedule and details panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Schedule List */}
        <div className="flex-1 space-y-6">
          {availableDays.map((day) => (
            <div
              key={day}
              className="transition-shadow duration-300 rounded-xl bg-white dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="space-y-4">
                  {getClassesForDay(day).map((classItem) => (
                    <div
                      key={classItem._id}
                      onClick={() => setSelectedClass(classItem)}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                      style={{
                        borderLeftColor: classItem.color,
                        borderLeftWidth: "5px",
                      }}
                    >
                      <h4 className="font-semibold text-base">
                        {classItem.subject}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="h-4 w-4" />
                        {classItem.time_start} - {classItem.time_end}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        {classItem.instructor}
                      </div>
                      {classItem.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {classItem.location}
                        </div>
                      )}
                    </div>
                  ))}
                  {getClassesForDay(day).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                      No classes scheduled
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Panel */}
        {selectedClass && (
          <div className="w-full lg:w-96 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {selectedClass.subject}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingClass(selectedClass);
                    setIsDialogOpen(true);
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Edit className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(selectedClass._id)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedClass(null)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>
                  <strong>Instructor:</strong> {selectedClass.instructor}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  <strong>Time:</strong> {selectedClass.time_start} -{" "}
                  {selectedClass.time_end}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>
                  <strong>Day:</strong> {selectedClass.day}
                </span>
              </p>
              {selectedClass.location && (
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    <strong>Location:</strong> {selectedClass.location}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
