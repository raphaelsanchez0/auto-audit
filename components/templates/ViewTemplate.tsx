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
        <Button className="w-full">Audit</Button>
      </CardFooter>
    </Card>
  );
}
