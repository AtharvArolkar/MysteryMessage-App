"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/interfaces/apiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function MessgaePage({
  params,
}: {
  params: { username: string };
}) {
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });
  const [iseSending, setIsSedning] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSedning(true);
    try {
      const result = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });

      toast({ title: "Message Sent" });
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({ title: axiosError.response?.data.message });
    } finally {
      setIsSedning(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Ask me any question
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the message</FormLabel>
                  <Textarea
                    {...field}
                    name="message"
                    placeholder="Type your message here."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={iseSending}>
              {iseSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending message...
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
