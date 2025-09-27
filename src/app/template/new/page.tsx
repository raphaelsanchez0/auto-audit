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

const specSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  maxRating: z.number().min(1, { message: "Max rating must be at least 1." }),
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specs: z
    .array(specSchema)
    .min(1, { message: "At least one spec is required." }),
});

export default function NewTemplateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }
  return (
    <div className="page">
      <Card>
        <CardHeader>
          <CardTitle>New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
