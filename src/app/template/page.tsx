"use client";
import ViewTemplate from "@/components/templates/ViewTemplate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Template } from "@/src/generated/prisma";
import { TemplateWithSpecCount } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/ui/navbar";

export default function TemplatePage() {
  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery<TemplateWithSpecCount[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch("/api/template");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });

  return (
    <div className="page">
      <>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-semibold"></h2>
      </main>
    </>
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
        <CardContent className="flex justify-center flex-col items-center">
          <Link href="/template/new">
            <Button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Create Template
            </Button>
          </Link>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {templates?.map((template) => (
              <ViewTemplate key={template.id} template={template} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
