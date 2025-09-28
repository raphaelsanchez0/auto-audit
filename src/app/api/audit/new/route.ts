// app/api/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = parseInt(searchParams.get("templateId") || "");

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: "Invalid or missing templateId" },
        { status: 400 }
      );
    }

    const audit = await prisma.audit.create({
      data: {
        templateId,
      },
    });

    return NextResponse.json({ auditId: audit.id }, { status: 201 });
  } catch (err) {
    console.error("Error creating audit:", err);
    return NextResponse.json(
      { error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
