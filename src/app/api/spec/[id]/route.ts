import { NextResponse } from "next/server";
import { prisma } from "@/src/utils/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Missing or invalid spec id" },
        { status: 400 }
      );
    }

    const spec = await prisma.spec.findUnique({
      where: { id },
      include: {
        template: true,
        auditSpecs: true,
      },
    });

    if (!spec) {
      return NextResponse.json({ error: "Spec not found" }, { status: 404 });
    }

    return NextResponse.json(spec);
  } catch (err) {
    console.error("Error fetching spec:", err);
    return NextResponse.json(
      { error: "Failed to fetch spec" },
      { status: 500 }
    );
  }
}
