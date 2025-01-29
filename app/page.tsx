import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <Building2 className="h-16 w-16 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Real Estate Admin Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Manage your real estate portfolio with our powerful admin dashboard.
            List properties, track performance, and grow your business.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}