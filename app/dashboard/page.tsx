import { auth } from "@/auth";
import MainView from "@/components/MainView";
import { getEvents } from "@/lib/actions";
import { CalendarEventType } from "@/types";
import { headers } from "next/headers";

// import { headers } from "next/headers";
export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const data = await getEvents(); 
  return (
    <div>
      <MainView
        events={data.events as unknown as CalendarEventType[]}
        role={session?.user.role as string}
      />
    </div>
  );
}
