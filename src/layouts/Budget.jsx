import { useState, useEffect } from "react";
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
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const Budget = () => {
  const [entries, setEntries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("income");
  const [loading, setLoading] = useState(true);

  const categories = {
    income: ["Allowance", "Job", "Scholarship", "Gift", "Other"],
    expense: [
      "Food",
      "Transport",
      "Books",
      "Entertainment",
      "Supplies",
      "Other",
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setEntries([
        {
          id: "1",
          type: "income",
          amount: 500,
          category: "Allowance",
          description: "Monthly allowance",
          date: "2025-09-01",
        },
        {
          id: "2",
          type: "expense",
          amount: 100,
          category: "Food",
          description: "Groceries",
          date: "2025-09-02",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get("amount"));

    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a positive amount",
        className: "bg-red-500 text-white",
      });
      return;
    }

    const entryData = {
      id: Date.now().toString(),
      type: formData.get("type"),
      amount,
      category: formData.get("category"),
      description: formData.get("description"),
      date: formData.get("date"),
    };

    setEntries((prev) => [entryData, ...prev]);
    toast({ title: "Entry Added", className: "bg-blue-500 text-white" });
    setIsDialogOpen(false);
    setSelectedType("income");
    e.target.reset();
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast({ title: "Entry Deleted", className: "bg-blue-500 text-white" });
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

  const COLORS = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-purple-400",
    "bg-pink-400",
  ].map((color) => color.replace("bg-", ""));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 animate-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center lg:flex-row flex-col lg:text-left text-center gap-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Budget
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your income and expenses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                New Entry
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  defaultValue="income"
                  onValueChange={setSelectedType}
                  required
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
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                Add
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Income
                </p>
                <p className="text-2xl font-bold text-green-500">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expenses
                </p>
                <p className="text-2xl font-bold text-red-500">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
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
            </div>
          </CardContent>
        </Card>
      </div>

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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
                key={entry.id}
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
                    onClick={() => handleDelete(entry.id)}
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
    </div>
  );
};

export default Budget;
