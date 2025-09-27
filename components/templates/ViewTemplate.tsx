"use client";
import { Template } from "@/src/generated/prisma";
import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { TemplateWithSpecCount } from "@/src/types";
import Link from "next/link";

interface ViewTemplateProps {
  template: TemplateWithSpecCount;
}

export default function ViewTemplate({ template }: ViewTemplateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
        <CardDescription>{template.specCount} requirements</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button className="w-full">
          <Link href={`/audit/${template.id}`}>View Audit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
