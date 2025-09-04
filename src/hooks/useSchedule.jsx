import { create } from "zustand";
import api from "../lib/axiosInstance";
import { toast } from "sonner";

export const useScheduleStore = create((set, get) => ({
  classes: [],
  loading: false,

  fetchClasses: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/schedule");
      set({ classes: res.data, loading: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schedule");
      set({ loading: false });
    }
  },

  addClass: async (classData) => {
    try {
      const res = await api.post("/schedule", classData);
      set((state) => ({ classes: [res.data, ...state.classes] }));
      toast.success("Class added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add class");
    }
  },

  updateClass: async (id, classData) => {
    try {
      const res = await api.put(`/schedule/${id}`, classData);
      set((state) => ({
        classes: state.classes.map((c) => (c._id === id ? res.data : c)),
      }));
      toast.success("Class updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update class");
    }
  },

  deleteClass: async (id) => {
    try {
      await api.delete(`/schedule/${id}`);
      set((state) => ({
        classes: state.classes.filter((c) => c._id !== id),
      }));
      toast.success("Class deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete class");
    }
  },
}));
