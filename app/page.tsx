import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./(auth)/sign-in/signin-form";
import { auth } from "@/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex h-svh w-full items-center justify-center">
      <section className="relative hidden h-full flex-1 items-center justify-center border-r lg:flex">
        <Image
          src="/sign-in.jpg"
          alt="Image"
          className="w-full object-cover  "
          fill
        />
      </section>
      <section className="bg-mute flex h-full flex-1 items-center justify-center">
        <Tabs defaultValue="admin" className="w-full max-w-96 px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
          </TabsList>
          <TabsContent value="admin">
            <Card className="mx-auto w-full max-w-md border-none bg-card shadow-lg dark:border">
              <CardHeader className="text-center">
                <CardTitle className="font-bold tracking-tight">
                  Admin
                </CardTitle>
                <CardDescription className="text-base">
                  Masukan password untuk melanjutkan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm email="utaki.sauki19@gmail.com" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="user">
            <Card className="mx-auto w-full max-w-md border-none bg-card shadow-lg dark:border">
              <CardHeader className="text-center">
                <CardTitle className="font-bold tracking-tight">User</CardTitle>
                <CardDescription className="text-base">
                  Masukan password untuk melanjutkan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm email="" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      {/* <Image src="/bmck.jpeg" alt="Image" height={100} width={100} className="absolute bottom-0 right-0" /> */}
    </main>
  );
}
