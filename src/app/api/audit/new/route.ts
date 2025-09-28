import { NextResponse } from "next/server";
import { prisma } from "@/src/utils/prisma";

export async function POST(req: Request) {
  try {
    const { templateId } = await req.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "Missing required field: templateId" },
        { status: 400 }
      );
    }

    const audit = await prisma.audit.create({
      data: {
        templateId: Number(templateId),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(audit);
  } catch (err) {
    console.error("Error creating audit:", err);
    return NextResponse.json(
      { error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
