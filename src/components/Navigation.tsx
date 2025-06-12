
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Website Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-blue-800">
              H1B for Healthcare
            </h1>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    H1B Data
                  </Button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Green Card
                  </Button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Prevailing Wages
                  </Button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Jobs
                  </Button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
                    More
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-48">
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                          Resources
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                          FAQ
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600">
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Login Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Log In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
