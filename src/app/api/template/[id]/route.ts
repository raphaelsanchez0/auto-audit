import { PrismaClient } from "@/src/generated/prisma";
import { NextResponse } from "next/server";
import { prisma } from "@/src/utils/prisma";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Missing or invalid template id" },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        specs: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: template.id,
      name: template.name,
      description: template.description,
      createdAt: template.createdAt,
      specs: template.specs,
    });
  } catch (err) {
    console.error("Error fetching template:", err);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
