// import { Outlet } from "react-router";
// import Sidebar from "./components/Sidebar";
// import BottomNavigation from "./components/BottomNavigation";
// import { useState } from "react";

// const App = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div className="flex lg:flex-row flex-col">
//       <div className="lg:flex hidden min-h-screen">
//         <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       </div>
//       <main
//         className={`p-4 transition-all duration-300
//         }`}
//       >
//         <Outlet />
//       </main>
//       <BottomNavigation />
//     </div>
//   );
// };

// export default App;

import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import BottomNavigation from "./components/BottomNavigation";
import { useState } from "react";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar (only visible on lg and above) */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-[75px]" : "w-64"
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 transition-all duration-300">
        <Outlet />
      </main>

      {/* Bottom Navigation (only visible on small screens) */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default App;
