import { NavLink } from "react-router";
import {
  Home,
  Calendar,
  DollarSign,
  HelpCircle,
  BookOpen,
  Clock,
  CheckSquare,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigationItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Class Schedule", url: "/schedule", icon: Calendar },
    { title: "Budget Tracker", url: "/budget", icon: DollarSign },
    { title: "Q&A Generator", url: "/quiz", icon: HelpCircle },
    { title: "Study Planner", url: "/study", icon: BookOpen },
    { title: "Focus Mode", url: "/focus", icon: Clock },
    { title: "To-Do List", url: "/todo", icon: CheckSquare },
  ];

  return (
    <div
      className={`h-full p-4 bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-purple-500" />
          {!isCollapsed && (
            <span className="text-xl font-semibold ml-2">SLT</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-white" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center py-2 rounded transition-colors duration-200 ${
                isActive
                  ? "bg-purple-900 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              } ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}`
            }
          >
            <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-2"}`} />
            {!isCollapsed && <span className="font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
