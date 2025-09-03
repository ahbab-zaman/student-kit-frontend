import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { AnimatedLogo } from "../components/Header";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 10,
    completedTasks: 7,
    totalBudget: 1000,
    totalExpenses: 650,
    upcomingClasses: 5,
    pomodoroSessions: 12,
  });
  const [loading, setLoading] = useState(true);

  const weeklyProgress = [
    { day: "Mon", tasks: 8, study: 5 },
    { day: "Tue", tasks: 12, study: 7 },
    { day: "Wed", tasks: 6, study: 4 },
    { day: "Thu", tasks: 15, study: 9 },
    { day: "Fri", tasks: 10, study: 6 },
    { day: "Sat", tasks: 5, study: 8 },
    { day: "Sun", tasks: 3, study: 4 },
  ];

  const taskDistribution = [
    {
      name: "Completed",
      value: stats.completedTasks,
      color: "green-400",
    },
    {
      name: "Pending",
      value: stats.totalTasks - stats.completedTasks,
      color: "yellow-400",
    },
  ];

  const budgetData = [
    { category: "Food", amount: 400, color: "blue-400" },
    { category: "Books", amount: 200, color: "purple-400" },
    { category: "Transport", amount: 150, color: "pink-400" },
    { category: "Entertainment", amount: 100, color: "yellow-400" },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const completionRate =
    stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const budgetRemaining = stats.totalBudget - stats.totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in slide-in-from-top duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <AnimatedLogo size="large" />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back!
          </p>
          <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            User
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Remaining
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetRemaining}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ${stats.totalExpenses} spent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingClasses}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              this semester
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Focus Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pomodoroSessions}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              total completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              <Target className="h-5 w-5" />
              <span>Task Completion Rate</span>
            </CardTitle>
            <CardDescription>Your productivity this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <Badge
                className={
                  completionRate >= 70
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }
              >
                {completionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress
              value={completionRate}
              className="w-full bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Activity</span>
            </CardTitle>
            <CardDescription>Tasks completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid gray",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Task Distribution
            </CardTitle>
            <CardDescription>Current task status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid gray",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {taskDistribution.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Budget Overview
            </CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${item.amount}</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Expenses</span>
                  <span>
                    ${budgetData.reduce((sum, item) => sum + item.amount, 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
