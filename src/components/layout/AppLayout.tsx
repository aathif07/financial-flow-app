
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, PiggyBank, BarChart3, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: PiggyBank },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Categories", href: "/categories", icon: FolderPlus },
];

export const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r shadow-sm">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-primary">FinTrack</h1>
        </div>
        <nav className="flex-1 pt-5">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    item.href === location.pathname
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            FinTrack © 2025
          </p>
        </div>
      </div>

      {/* Mobile navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full md:hidden border-t bg-card">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3",
                item.href === location.pathname
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
