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
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface ViewTemplateProps {
  template: TemplateWithSpecCount;
}

export default function ViewTemplate({ template }: ViewTemplateProps) {
  const router = useRouter();
  const createAuditMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/audit/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to create audit");
      }
      return res.json() as Promise<{ id: number }>;
    },
    onSuccess: (data) => {
      // redirect to audit page with auditId in query
      router.push(`/audit/${data.id}?templateId=${template.id}`);
    },
  });
  function handleAuditClicked() {
    createAuditMutation.mutate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
        <CardDescription>{template.specCount} requirements</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          onClick={handleAuditClicked}
          disabled={createAuditMutation.isPending}
        >
          View Audit
        </Button>
      </CardFooter>
    </Card>
  );
}
