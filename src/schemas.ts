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
