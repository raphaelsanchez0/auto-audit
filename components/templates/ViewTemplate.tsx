"use client";
import { TemplateWithSpecCount } from "@/src/types";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface ViewTemplateProps {
  template: TemplateWithSpecCount;
}

export default function ViewTemplate({ template }: ViewTemplateProps) {
  const router = useRouter();

  const createAudit = useMutation({
    mutationFn: async (templateId: number) => {
      const res = await fetch(`/api/audit/new?templateId=${templateId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to create audit");
      return res.json() as Promise<{ auditId: number }>;
    },
    onSuccess: (data) => {
      // push with templateId as the path and auditId as a query param
      router.push(`/audit/${template.id}?auditId=${data.auditId}`);
    },
  });

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
          onClick={() => createAudit.mutate(template.id)}
          disabled={createAudit.isPending}
        >
          {createAudit.isPending ? "Creating..." : "Start Audit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
