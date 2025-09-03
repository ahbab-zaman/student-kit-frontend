import { NavLink } from "react-router";
import {
  Home,
  Calendar,
  DollarSign,
  HelpCircle,
  BookOpen,
  Clock,
  CheckSquare,
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Class Schedule", url: "/schedule", icon: Calendar },
  { title: "Budget Tracker", url: "/budget", icon: DollarSign },
  { title: "Q&A Generator", url: "/quiz", icon: HelpCircle },
  { title: "Study Planner", url: "/study", icon: BookOpen },
  { title: "Focus Mode", url: "/focus", icon: Clock },
  { title: "To-Do List", url: "/todo", icon: CheckSquare },
];

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-t border-gray-800 lg:hidden z-50">
      <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg text-xs transition-colors ${
                isActive
                  ? "text-purple-500 bg-purple-900/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
