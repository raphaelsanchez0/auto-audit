import { PrismaClient, Prisma } from "@/src/generated/prisma";
import { templateSchema } from "@/src/schemas";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(request: NextResponse) {
  try {
    const json = await request.json();
    const body = templateSchema.parse(json);
    console.log(body);
    const newTemplateEntity = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description,
        specs: {
          create: body.specs.map((s) => ({
            name: s.name,
            description: s.description,
            maxRating: s.maxRating,
          })),
        },
      },
      include: { specs: true },
    });

    return NextResponse.json(newTemplateEntity, { status: 201 });
  } catch (err) {
    console.error("Error creating template:", err);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
