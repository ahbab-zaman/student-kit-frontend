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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
        description: "Please enter a positive amount",
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
        toast({ title: "Entry Updated", className: "bg-blue-500 text-white" });
      } else {
        await addEntry(entryData);
        toast({ title: "Entry Added", className: "bg-blue-500 text-white" });
      }
      setIsDialogOpen(false);
      setSelectedType("income");
      setEditingEntry(null);
      e.target.reset();
    } catch {
      toast({ variant: "destructive", title: "Failed to save entry" });
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
      toast({ title: "Entry Deleted", className: "bg-blue-500 text-white" });
    } catch {
      toast({ variant: "destructive", title: "Failed to delete entry" });
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="py-6 space-y-6 animate-in slide-in-from-top duration-300">
      {/* Header */}
      <div className="flex justify-between items-center lg:flex-row flex-col lg:text-left text-center gap-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Budget
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your income and expenses
          </p>
        </div>

        {/* Add/Edit Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              {editingEntry ? "Edit Entry" : "Add Entry"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-800/80">
            <DialogHeader>
              <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                {editingEntry ? "Edit Entry" : "New Entry"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue={editingEntry ? editingEntry.type : "income"}
                  onValueChange={setSelectedType}
                  required
                  className="bg-white dark:bg-gray-700"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  defaultValue={editingEntry ? editingEntry.category : ""}
                  required
                  className="bg-white dark:bg-gray-700"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[selectedType].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                {editingEntry ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
              <p className="text-2xl font-bold text-green-500">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expenses
              </p>
              <p className="text-2xl font-bold text-red-500">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Savings
              </p>
              <p
                className={`text-2xl font-bold ${
                  savings >= 0 ? "text-blue-500" : "text-red-500"
                }`}
              >
                ${savings.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Expense Pie Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            entries.slice(0, 5).map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between p-3 border-b last:border-0"
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
                    className={`text-sm font-medium ${
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
        <DialogContent className="sm:max-w-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirm Delete</DialogTitle>
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
