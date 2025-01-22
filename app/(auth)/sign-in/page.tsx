import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "./signin-form";
// import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Image src={"/logoipsum-349.svg"} width={64} height={64} alt="Logo" />
        </CardTitle>
        <CardDescription className="flex items-center justify-center">
          Selamat datang di dpu bmck kalender
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p> */}
      </CardFooter>
    </Card>
  );
}
