"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    {
      name: "Total Properties",
      value: "12",
      icon: Building2,
      description: "Active listings in your portfolio",
    },
    {
      name: "Total Revenue",
      value: "$45,000",
      icon: DollarSign,
      description: "Revenue this month",
    },
    {
      name: "Inquiries",
      value: "24",
      icon: Users,
      description: "New inquiries this week",
    },
    {
      name: "Growth",
      value: "+12.5%",
      icon: TrendingUp,
      description: "Portfolio growth this quarter",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your properties today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}