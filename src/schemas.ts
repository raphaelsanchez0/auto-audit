import { z } from "zod";

export const specSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  maxRating: z.number().min(1, { message: "Max rating must be at least 1." }),
});

export const templateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  specs: z
    .array(specSchema)
    .min(1, { message: "At least one spec is required." }),
});

export const proofSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string().min(1, "Enter some text"),
  }),
  z.object({
    type: z.literal("screenshot"),
    file: z.instanceof(File, { message: "Upload an image" }),
  }),
  z.object({
    type: z.literal("document"),
    file: z.instanceof(File, { message: "Upload a PDF" }),
  }),
]);

export const auditSchema = z.object({
  context: z.string().optional(),
  proof: proofSchema,
});
