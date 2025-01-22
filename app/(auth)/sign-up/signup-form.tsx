"use client";

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
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { authSchema, AuthSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      password: "",
      email: "",
      name: "",
    },
  });

  async function onSubmit(values: AuthSchema) {
    const { name, email, password } = values;

    startTransition(async () => {
      try {
        await authClient.signUp.email(
          {
            email,
            password,
            name,
            callbackURL: "/sign-in",
          },
          {
            onRequest: () => {
              toast({
                title: "Please wait...",
              });
            },
            onSuccess: () => {
              router.push("/sign-in");
            },
            onError: (ctx) => {
              toast({ title: ctx.error.message, variant: "destructive" });
            },
          }
        );
      } catch (error) {
        toast({
          title: "Something went wrong" + error,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>This is your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>This is your name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="" 
                  {...field} 
                  disabled={isPending} 
                />
              </FormControl>
              <FormDescription>This is your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

// Errro di web ki kyk gampang dek