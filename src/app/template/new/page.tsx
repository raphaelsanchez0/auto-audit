"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Prisma, Template } from "@/src/generated/prisma";
import { templateSchema } from "@/src/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PrismaClient } from "@/src/generated/prisma";

const prisma = new PrismaClient();

export default function NewTemplateForm() {
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      specs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specs",
  });

  function handleAddSpec() {
    append({ name: "", description: "", maxRating: 1 });
  }

  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof templateSchema>) => {
      const res = await fetch("/api/template/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create template");
      return res.json();
    },
    onSuccess: () => {
      // Refetch the "templates" list
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof templateSchema>) {
    createTemplateMutation.mutate(data);
    router.push("/template");
  }
  return (
    <div className="page">
      <Card>
        <CardHeader>
          <CardTitle>New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name</FormLabel>
                    <FormControl>
                      <Input placeholder="NIST 800-171" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name of your compliance document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="NIST 800-171 description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Description of your compliance document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-lg font-medium">Specs</div>
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md space-y-4">
                  <FormField
                    control={form.control}
                    name={`specs.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Control Name</FormLabel>
                        <FormControl>
                          <Input placeholder="3.10.3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specs.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Description of the control"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specs.${index}.maxRating`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Rating</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            value={field.value ?? ""} // handle undefined
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : +e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />

                        <FormDescription>
                          The maximum rating for this control
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  {/* repeat for maxRating, evaluatedRating, etc. */}
                  <Button
                    type="button"
                    variant="destructiveOutline"
                    onClick={() => remove(index)}
                  >
                    Remove Spec
                  </Button>
                </div>
              ))}
              <div className="flex gap-1">
                <Button
                  type="button"
                  onClick={handleAddSpec}
                  variant={"outline"}
                >
                  Add Spec
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
