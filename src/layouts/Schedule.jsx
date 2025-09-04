import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useScheduleStore } from "../hooks/useSchedule";
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
import { Plus, Clock, User, MapPin, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const Schedule = () => {
  const { classes, loading, fetchClasses, addClass, updateClass, deleteClass } =
    useScheduleStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const colors = [
    { name: "Blue", value: "#60A5FA" },
    { name: "Green", value: "#4ADE80" },
    { name: "Purple", value: "#A78BFA" },
    { name: "Yellow", value: "#FACC15" },
    { name: "Red", value: "#F87171" },
    { name: "Pink", value: "#F472B6" },
    { name: "Cyan", value: "#22D3EE" },
  ];

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
    } else {
      addClass(classData);
    }

    setIsDialogOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      deleteClass(id);
    } else {
      toast("Delete cancelled");
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 animate-in slide-in-from-top duration-300">
      {/* Header with Search + Add Button */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Class Schedule
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your weekly class schedule
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 w-full lg:w-1/3">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by subject, instructor, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Add class button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {editingClass ? "Edit Class" : "Add New Class"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your class
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., Mathematics"
                  defaultValue={editingClass?.subject}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select name="day" defaultValue={editingClass?.day} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    name="color"
                    defaultValue={editingClass?.color || colors[0].value}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_start">Start Time</Label>
                  <Input
                    id="time_start"
                    name="time_start"
                    type="time"
                    defaultValue={editingClass?.time_start}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_end">End Time</Label>
                  <Input
                    id="time_end"
                    name="time_end"
                    type="time"
                    defaultValue={editingClass?.time_end}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  placeholder="e.g., Dr. Smith"
                  defaultValue={editingClass?.instructor}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Room 101"
                  defaultValue={editingClass?.location}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                {editingClass ? "Update Class" : "Add Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
        {days.map((day) => (
          <Card
            key={day}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {day}
              </CardTitle>
              <CardDescription>
                {getClassesForDay(day).length} classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getClassesForDay(day).map((classItem) => (
                <div
                  key={classItem._id}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  style={{
                    borderLeftColor: classItem.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">
                      {classItem.subject}
                    </h4>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingClass(classItem);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(classItem._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {classItem.time_start} - {classItem.time_end}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <User className="h-3 w-3" />
                    <span>{classItem.instructor}</span>
                  </div>
                  {classItem.location && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{classItem.location}</span>
                    </div>
                  )}
                </div>
              ))}
              {getClassesForDay(day).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No classes scheduled
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
