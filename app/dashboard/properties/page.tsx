"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from 'next/image';

const properties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    address: "123 Main St, City",
    price: "$450,000",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    address: "456 Ocean Ave, Beach City",
    price: "$1,200,000",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    address: "789 Park Rd, Metro City",
    price: "$1,800/month",
    status: "For Rent",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3",
  },
];

export default function Properties() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-gray-500 mt-2">
            Manage and track all your property listings
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="h-48 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
              <CardDescription>{property.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{property.price}</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {property.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Image
        src="/empty-properties.svg"
        alt="No properties found"
        width={300}
        height={200}
        className="mx-auto"
      />
    </div>
  );
}