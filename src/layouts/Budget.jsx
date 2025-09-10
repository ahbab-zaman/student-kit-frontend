import { useState, useEffect } from "react";
import { toast } from "sonner";
import useBudgetStore from "../hooks/useBudget";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trash2,
  Edit2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DialogDescription } from "@radix-ui/react-dialog";

const categories = {
  income: ["Allowance", "Job", "Scholarship", "Gift", "Other"],
  expense: ["Food", "Transport", "Books", "Entertainment", "Supplies", "Other"],
};

const COLORS = [
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#F87171",
  "#A78BFA",
  "#F472B6",
];

const Budget = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("income");
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const { entries, loading, fetchEntries, addEntry, deleteEntry, updateEntry } =
    useBudgetStore();

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get("amount"));

    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
      });
      return;
    }

    const entryData = {
      type: formData.get("type"),
      amount,
      category: formData.get("category"),
      description: formData.get("description"),
      date: formData.get("date"),
    };

    try {
      if (editingEntry) {
        await updateEntry(editingEntry._id, entryData);
        toast.success("Budget entry added successfully");
      } else {
        await addEntry(entryData);
        toast.success("Budget entry updated successfully");
      }
      setIsDialogOpen(false);
      setSelectedType("income");
      setEditingEntry(null);
      e.target.reset();
    } catch {
      toast.error("Failed to save entry");
    }
  };

  const confirmDelete = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;
    try {
      await deleteEntry(entryToDelete._id);
      toast.success("Entry Deleted");
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setSelectedType(entry.type);
    setIsDialogOpen(true);
  };

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpenses;

  const expensesByCategory = categories.expense
    .map((category) => ({
      name: category,
      value: entries
        .filter((e) => e.type === "expense" && e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.value > 0);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="py-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center lg:flex-row flex-col lg:text-left text-center gap-2">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm">
            Budget
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your income and expenses with ease
          </p>
        </div>

        {/* Add/Edit Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              {editingEntry ? "Edit Entry" : "Add Entry"}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl  
              max-h-[90vh] overflow-y-auto
              bg-white dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 
              p-6 rounded-2xl shadow-2xl backdrop-blur-md
              animate-in slide-in-from-top duration-500"
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {editingEntry ? "Edit Entry" : "New Entry"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue={editingEntry ? editingEntry.type : "income"}
                  onValueChange={setSelectedType}
                  required
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-lg">
                    <SelectItem
                      value="income"
                      className="hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      Income
                    </SelectItem>
                    <SelectItem
                      value="expense"
                      className="hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      Expense
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={editingEntry ? editingEntry.amount : ""}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  defaultValue={editingEntry ? editingEntry.category : ""}
                  required
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-lg">
                    {categories[selectedType].map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Brief description"
                  defaultValue={editingEntry ? editingEntry.description : ""}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={
                    editingEntry
                      ? new Date(editingEntry.date).toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform"
              >
                {editingEntry ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Income",
            value: totalIncome,
            color: "text-green-500",
            icon: TrendingUp,
          },
          {
            title: "Expenses",
            value: totalExpenses,
            color: "text-red-500",
            icon: TrendingDown,
          },
          {
            title: "Savings",
            value: savings,
            color: savings >= 0 ? "text-blue-500" : "text-red-500",
            icon: DollarSign,
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl"
          >
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <p className={`text-2xl font-bold ${item.color}`}>
                  ${item.value.toFixed(2)}
                </p>
              </div>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense Pie Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-xl">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No expenses to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-xl">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            entries.slice(0, 5).map((entry, idx) => (
              <div
                key={entry._id}
                className={`flex items-center justify-between p-3 border-b last:border-0 transition-colors ${
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""
                } hover:bg-gray-100 dark:hover:bg-gray-700/70`}
              >
                <div className="flex items-center space-x-3">
                  {entry.type === "income" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{entry.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.category} •{" "}
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-sm font-semibold ${
                      entry.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {entry.type === "income" ? "+" : "-"}$
                    {entry.amount.toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(entry)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No entries yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="w-full sm:max-w-md 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-gray-100 
            p-6 rounded-2xl shadow-2xl backdrop-blur-md
            animate-in slide-in-from-top duration-500"
        >
          <DialogHeader>
            <DialogTitle className="text-red-500 font-bold">
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new budget entry.
            </DialogDescription>
          </DialogHeader>
          <p className="py-4 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this entry? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budget;
