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
import { Plus, Clock, User, MapPin, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(true);

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
    "hsl(var(--color-english))",
    "hsl(var(--color-science))",
    "hsl(var(--color-art))",
    "hsl(var(--color-history))",
    "hsl(var(--color-math))",
    "hsl(var(--color-music))",
    "hsl(var(--color-science))",
  ];

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: "1",
          subject: "Mathematics",
          day: "Monday",
          time_start: "09:00",
          time_end: "10:30",
          instructor: "Dr. Smith",
          color: colors[0],
          location: "Room 101",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const classData = {
      id: editingClass ? editingClass.id : Date.now().toString(),
      subject: formData.get("subject"),
      day: formData.get("day"),
      time_start: formData.get("time_start"),
      time_end: formData.get("time_end"),
      instructor: formData.get("instructor"),
      location: formData.get("location"),
      color: formData.get("color"),
    };

    if (editingClass) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editingClass.id ? classData : c))
      );
      toast({ title: "Class updated successfully!" });
    } else {
      setClasses((prev) => [classData, ...prev]);
      toast({ title: "Class added successfully!" });
    }

    setIsDialogOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Class deleted successfully!" });
  };

  const getClassesForDay = (day) => {
    return classes
      .filter((c) => c.day === day)
      .sort((a, b) => a.time_start.localeCompare(b.time_start));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Class Schedule</h1>
          <p className="text-muted-foreground">
            Manage your weekly class schedule
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-card">
            <DialogHeader>
              <DialogTitle className="gradient-text">
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
                    <SelectContent>
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
                    defaultValue={editingClass?.color || colors[0]}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: color }}
                            />
                            <span>{color}</span>
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
              <Button type="submit" className="w-full btn-gradient">
                {editingClass ? "Update Class" : "Add Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <Card key={day} className="floating-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg gradient-text">{day}</CardTitle>
              <CardDescription>
                {getClassesForDay(day).length} classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getClassesForDay(day).map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-3 rounded-lg border border-border/40"
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
                        onClick={() => handleDelete(classItem.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {classItem.time_start} - {classItem.time_end}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{classItem.instructor}</span>
                  </div>
                  {classItem.location && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{classItem.location}</span>
                    </div>
                  )}
                </div>
              ))}
              {getClassesForDay(day).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
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
