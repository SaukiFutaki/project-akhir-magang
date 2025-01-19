import { DefaultDemo } from "@/components/tab-bar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers : await headers(),
  });

  console.log(session);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Button variant={"destructive"}>
        click me
      </Button>
      <DefaultDemo />
    </div>
  );
}
