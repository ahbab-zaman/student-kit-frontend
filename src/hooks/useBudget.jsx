// stores/budgetStore.js
import { create } from "zustand";
import api from "../lib/axiosInstance";

const useBudget = create((set, get) => ({
  entries: [],
  loading: true,

  fetchEntries: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/budget");
      set({ entries: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      set({ loading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      const { data } = await api.post("/budget", entry);
      set((state) => ({ entries: [data, ...state.entries] }));
    } catch (error) {
      console.error("Failed to add entry:", error);
      throw error;
    }
  },

  updateEntry: async (id, updatedEntry) => {
    try {
      const { data } = await api.put(`/budget/${id}`, updatedEntry);
      set((state) => ({
        entries: state.entries.map((e) => (e._id === id ? data : e)),
      }));
    } catch (error) {
      console.error("Failed to update entry:", error);
      throw error;
    }
  },

  deleteEntry: async (id) => {
    try {
      await api.delete(`/budget/${id}`);
      set((state) => ({ entries: state.entries.filter((e) => e._id !== id) }));
    } catch (error) {
      console.error("Failed to delete entry:", error);
      throw error;
    }
  },
}));

export default useBudget;
