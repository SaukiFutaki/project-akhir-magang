import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });




  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <h1 className="text-white text-2xl">
        {session ? `Welcome back! ${session.user.email}` : "Welcome!"}
      </h1>
      {session ? (
        <form
          action={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/sign-in");
          }}
        >
          <Button>Sign out</Button>
        </form>
      ) : (
        <Button>Sign in</Button>
      )}
     
    </div>
  );
}
