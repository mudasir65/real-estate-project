"use client";

import { Building2, Home, LogOut, User, Users, PcCase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Account", href: "/dashboard/account", icon: User },
  { name: "Assistants", href: "/dashboard/assistants", icon: Building2 },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Assigned Users", href: "/dashboard/assigned-users", icon: PcCase }
];

export default function DashboardNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      isActive
                        ? "border-b-2 border-primary text-gray-900"
                        : "text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}