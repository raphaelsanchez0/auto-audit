import { PrismaClient, Prisma } from "@/src/generated/prisma";
import { templateSchema } from "@/src/schemas";
import { NextResponse } from "next/server";

import { prisma } from "@/src/utils/prisma";
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      include: {
        specs: true, // so we can count
        _count: true,
      },
    });

    // You could also project only counts instead of full specs
    return NextResponse.json(
      templates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        createdAt: t.createdAt,
        specCount: t._count.specs,
      }))
    );
  } catch (err) {
    console.error("Error fetching templates:", err);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
