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
        className: "btn-gradient text-white",
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
    toast({ title: "Entry Added", className: "btn-gradient text-white" });
    setIsDialogOpen(false);
    setSelectedType("income");
    e.target.reset();
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast({ title: "Entry Deleted", className: "btn-gradient text-white" });
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
    "hsl(var(--color-english))",
    "hsl(var(--color-science))",
    "hsl(var(--color-history))",
    "hsl(var(--color-math))",
    "hsl(var(--color-art))",
    "hsl(var(--color-music))",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Budget</h1>
          <p className="text-muted-foreground">
            Track your income and expenses
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md glass-card">
            <DialogHeader>
              <DialogTitle className="gradient-text">New Entry</DialogTitle>
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
              <Button type="submit" className="w-full btn-gradient">
                Add
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="floating-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-science))]">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-[hsl(var(--color-science))]" />
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-[hsl(var(--color-math))]">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-6 w-6 text-[hsl(var(--color-math))]" />
            </div>
          </CardContent>
        </Card>
        <Card className="floating-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings</p>
                <p
                  className={`text-2xl font-bold ${
                    savings >= 0
                      ? "text-[hsl(var(--color-english))]"
                      : "text-[hsl(var(--color-math))]"
                  }`}
                >
                  ${savings.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-[hsl(var(--color-english))]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="gradient-text">Expense Breakdown</CardTitle>
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
            <p className="text-center text-muted-foreground py-8">
              No expenses to display
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="gradient-text">Recent Entries</CardTitle>
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
                    <TrendingUp className="h-4 w-4 text-[hsl(var(--color-science))]" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-[hsl(var(--color-math))]" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.category} •{" "}
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-sm font-medium ${
                      entry.type === "income"
                        ? "text-[hsl(var(--color-science))]"
                        : "text-[hsl(var(--color-math))]"
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
            <p className="text-center text-muted-foreground py-8">
              No entries yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;
