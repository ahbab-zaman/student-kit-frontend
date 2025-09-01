import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AnimatedLogo = () => (
  <span className="text-xl font-semibold text-purple-500">
    Student Life Toolkit
  </span>
);

export const Header = () => {
  return (
    <header className="bg-gray-900 text-white flex items-center justify-between p-4 w-full">
      <div className="flex items-center">
        <AnimatedLogo />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-900 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">ahbabtahmin</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-purple-500 text-white hover:bg-purple-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
