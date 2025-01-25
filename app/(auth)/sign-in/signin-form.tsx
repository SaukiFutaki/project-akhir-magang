"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { signInSchema, SignInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export default function SignInForm({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: email,
      password: "",
    },
  });

  async function onSubmit(values: SignInSchema) {
    const { email, password } = values;

    startTransition(async () => {
      try {
        await authClient.signIn.email(
          {
            email,
            password,
            callbackURL: "/dashboard",
          },
          {
            onRequest: () => {
              toast({
                title: "Sedang masuk...",
              });
            },
            onSuccess: () => {
              toast({
                title: "Berhasil masuk!",
              });
              router.push("/dashboard");
            },
            onError: (ctx) => {
              toast({
                title: "Gagal masuk",
                description: ctx.error.message,
                variant: "destructive",
              });
            },
          }
        );
      } catch (error) {
        toast({
          title: "Terjadi kesalahan " + error,
          description: "Silakan coba lagi nanti",
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="password"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Masuk"}
        </Button>
      </form>
    </Form>
  );
}
