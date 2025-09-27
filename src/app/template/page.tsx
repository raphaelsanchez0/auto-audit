import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

export default function TemplatePage() {
  return (
    <div className="page">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight text-center">
            Templates
          </CardTitle>
          <CardDescription className="text-center mt-2">
            Templates are an reuseable way to handle your government specs. Get
            started by making one below
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/template/new">
            <Button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Create Template
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
