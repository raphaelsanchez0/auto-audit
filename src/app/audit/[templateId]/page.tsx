"use client";
import AuditSidebar from "@/components/audit/AuditSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Spec, Template } from "@/src/generated/prisma";
import { auditSchema } from "@/src/schemas";
import { TemplateWithSpecs } from "@/src/types";
import { getSpec, getTemplate } from "@/src/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function AuditPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const specId = searchParams.get("spec");
  const firstSpecId = searchParams.get("firstId");
  const lastSpecId = searchParams.get("lastId");

  const isOnFirst = specId === firstSpecId;
  const isOnLast = specId === lastSpecId;
  const {
    data: template,
    isLoading,
    isError,
  } = useQuery<TemplateWithSpecs>({
    queryKey: ["templates", templateId],
    queryFn: () => getTemplate(parseInt(templateId)),
  });

  const {
    data: spec,
    isLoading: specLoading,
    isError: specError,
  } = useQuery<Spec>({
    queryKey: ["spec", specId],
    queryFn: () => getSpec(parseInt(specId!!)),
    enabled: !!specId,
  });

  function handlePrevClicked() {
    if (!specId) return;
    const currentSpecId = parseInt(specId);
    const newSpecId = currentSpecId - 1;

    if (firstSpecId && newSpecId >= parseInt(firstSpecId)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("spec", newSpecId.toString());
      router.push(`/audit/${templateId}?${params.toString()}`);
    }
  }

  function handleNextClicked() {
    if (!specId) return;
    const currentSpecId = parseInt(specId);
    const newSpecId = currentSpecId + 1;

    if (lastSpecId && newSpecId <= parseInt(lastSpecId)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("spec", newSpecId.toString());
      router.push(`/audit/${templateId}?${params.toString()}`);
    }
  }

  const [textProof, setTextProof] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [context, setContext] = useState("");

  const auditMutation = useMutation({
    mutationFn: async () => {
      if (!spec) throw new Error("Spec is missing");

      const payload = {
        spec: spec, // or spec.name
        proof: textProof,
        context,
        maxScore: spec.maxRating,
      };

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to audit");
      }

      return res.json();
    },
  });

  console.log(documentFile);

  return (
    <div className="w-full flex">
      <div className="w-3/12 border-r">
        {template?.specs ? (
          <AuditSidebar templateId={templateId} specs={template?.specs} />
        ) : (
          <Skeleton className="h-10" />
        )}
      </div>
      <div className="w-9/12">
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-xl">Requirement {spec?.name}</CardTitle>
            <CardDescription>{spec?.description}</CardDescription>
          </CardHeader>
          <div className="w-full px-6">
            <Separator />
          </div>
          <CardContent>
            <div className="space-y-2">
              <CardTitle className="">Proof of Compliance</CardTitle>
              <CardDescription></CardDescription>
              <div className="flex w-full flex-col gap-6">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                    <TabsTrigger value="document">Document</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text">
                    <Textarea />
                  </TabsContent>
                  <TabsContent value="screenshot">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setScreenshotFile(e.target.files?.[0] ?? null);
                      }}
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    />
                  </TabsContent>
                  <TabsContent value="document">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setDocumentFile(e.target.files?.[0] ?? null)
                      }
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <CardTitle className="mt-6">Additional Context</CardTitle>
              <CardDescription>
                Any additional information that may be relevant proof for the
                audit.
              </CardDescription>

              <Textarea
                className="w-full"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <div className="flex justify-between pt-2">
                <Button disabled={isOnFirst} onClick={handlePrevClicked}>
                  <ChevronLeft />
                </Button>
                <Button
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => auditMutation.mutate()}
                >
                  Auto Audit
                </Button>
                <Button disabled={isOnLast} onClick={handleNextClicked}>
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-xl">Feedback</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
