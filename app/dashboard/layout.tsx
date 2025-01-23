import { auth } from "@/auth";
import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="">
      <ScrollArea className="h-[100vh]">
        <Header />
        <MainView />
      </ScrollArea>
    </div>
  );
}
