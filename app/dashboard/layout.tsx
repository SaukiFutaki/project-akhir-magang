
import Header from "@/components/header/Header";
import MainView from "@/components/MainView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEvents } from "@/lib/actions";
import { CalendarEventType } from "@/types";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

export default async function DashboardLayout() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session) {
  //   redirect("/sign-in");
  // }

  const data = await getEvents();
  return (
    <div className="">
      <ScrollArea className="h-[100vh]">
        <Header />
        <MainView events={data.events  as unknown as CalendarEventType[]}/>
      </ScrollArea>
    </div>
  );
}
