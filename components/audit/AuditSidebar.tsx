import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Spec } from "@/src/generated/prisma";

interface AuditSidebarProps {
  templateId: number;
  specs: Spec[];
}
export default function AuditSidebar({ templateId, specs }: AuditSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const firstId = specs.length > 0 ? specs[0].id : null;
  const lastId = specs.length > 0 ? specs[specs.length - 1].id : null;

  function handleSpecSelection(specId: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (firstId !== null) params.set("firstId", firstId.toString());
    if (lastId !== null) params.set("lastId", lastId.toString());

    params.set("spec", specId.toString());
    const queryString = params.toString();
    const newUrl = `/audit/${templateId}?${queryString}`;
    router.push(newUrl);
  }
  return (
    <SidebarProvider>
      <Sidebar className="h-screen">
        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Requirements</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {specs.map((spec) => (
                  <SidebarMenuItem key={spec.id}>
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        title={spec.name}
                        onClick={() => handleSpecSelection(spec.id)}
                      >
                        {spec.name}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
