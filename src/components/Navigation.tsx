import { useState } from "react";
import { Bell, Calendar, Users, BarChart3, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  userRole: "patient" | "practitioner" | "admin";
  onRoleChange: (role: "patient" | "practitioner" | "admin") => void;
}

export function Navigation({ userRole, onRoleChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavItems = () => {
    const commonItems = [
      { icon: Calendar, label: "Schedule", id: "schedule" },
      { icon: Bell, label: "Notifications", id: "notifications" },
    ];

    switch (userRole) {
      case "patient":
        return [
          ...commonItems,
          { icon: BarChart3, label: "Progress", id: "progress" },
          { icon: Settings, label: "Settings", id: "settings" },
        ];
      case "practitioner":
        return [
          ...commonItems,
          { icon: Users, label: "Patients", id: "patients" },
          { icon: BarChart3, label: "Analytics", id: "analytics" },
          { icon: Settings, label: "Settings", id: "settings" },
        ];
      case "admin":
        return [
          { icon: BarChart3, label: "Dashboard", id: "dashboard" },
          { icon: Users, label: "Staff", id: "staff" },
          { icon: Calendar, label: "Scheduling", id: "scheduling" },
          { icon: Settings, label: "System", id: "system" },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="wellness-card mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">AyurSutra</h1>
          <Badge variant="secondary" className="capitalize">
            {userRole}
          </Badge>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.id} variant="ghost" size="sm">
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
          
          <div className="ml-4 border-l pl-4 space-x-2">
            <Button
              variant={userRole === "patient" ? "default" : "outline"}
              size="sm"
              onClick={() => onRoleChange("patient")}
            >
              Patient
            </Button>
            <Button
              variant={userRole === "practitioner" ? "default" : "outline"}
              size="sm"
              onClick={() => onRoleChange("practitioner")}
            >
              Practitioner
            </Button>
            <Button
              variant={userRole === "admin" ? "default" : "outline"}
              size="sm"
              onClick={() => onRoleChange("admin")}
            >
              Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="mt-4 md:hidden border-t pt-4 space-y-2">
          {navItems.map((item) => (
            <Button key={item.id} variant="ghost" className="w-full justify-start">
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
          
          <div className="pt-4 border-t space-y-2">
            <Button
              variant={userRole === "patient" ? "default" : "outline"}
              className="w-full"
              onClick={() => onRoleChange("patient")}
            >
              Switch to Patient View
            </Button>
            <Button
              variant={userRole === "practitioner" ? "default" : "outline"}
              className="w-full"
              onClick={() => onRoleChange("practitioner")}
            >
              Switch to Practitioner View
            </Button>
            <Button
              variant={userRole === "admin" ? "default" : "outline"}
              className="w-full"
              onClick={() => onRoleChange("admin")}
            >
              Switch to Admin View
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}