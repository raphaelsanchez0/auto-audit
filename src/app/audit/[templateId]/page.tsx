"use client";
import AuditSidebar from "@/components/audit/AuditSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Spec, Template } from "@/src/generated/prisma";
import { TemplateWithSpecs } from "@/src/types";
import { getSpec, getTemplate } from "@/src/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import React, { use } from "react";

export default function AuditPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const specId = searchParams.get("spec");

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
          <CardContent className="space-y-2">
            <CardTitle className="">Proof of Compliance</CardTitle>
            <CardDescription></CardDescription>
            <div className="flex w-full flex-col gap-6">
              <Tabs defaultValue="text" className="w-full">
                <TabsList>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                  <TabsTrigger value="document">Document</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="w-full">
                  <Textarea className="w-full" />
                </TabsContent>
                <TabsContent value="screenshot" className="w-full">
                  <div>
                    <Input type="file" accept="image/*" />
                  </div>
                </TabsContent>
                <TabsContent value="document" className="w-full">
                  <div>
                    <Input type="file" accept="application/pdf" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <CardTitle className="mt-6">Additional Context</CardTitle>
            <CardDescription>
              Any additional information that may be relevant proof for the
              audit.
            </CardDescription>
            <Textarea className="w-full" />
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
