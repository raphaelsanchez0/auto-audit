// src/app/api/audit/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/utils/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = Number(params.id);

    if (isNaN(auditId)) {
      return NextResponse.json({ error: "Invalid audit id" }, { status: 400 });
    }

    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
      include: {
        template: {
          include: {
            specs: true, // all requirements in the template
          },
        },
        auditSpecs: {
          include: {
            spec: true, // bring in the spec each answer is tied to
          },
        },
      },
    });

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json(audit);
  } catch (err) {
    console.error("Error fetching audit:", err);
    return NextResponse.json(
      { error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}
