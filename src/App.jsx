import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import BottomNavigation from "./components/BottomNavigation";
import { useState } from "react";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex lg:flex-row flex-col">
      <div className="lg:flex hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <main
        className={`p-4 transition-all duration-300 ${
          isCollapsed ? "w-[calc(100vw-80px)]" : "w-[calc(100vw-256px)]"
        }`}
      >
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default App;
