"'use client";
import React, { use } from "react";

export default function AuditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { templateId } = use(params);
  return <div>Audit Page for template ID: {templateId}</div>;
}
