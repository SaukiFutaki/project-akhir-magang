import YearlyRecap from "@/components/yearly-recap";
import { getEvents } from "@/lib/actions";
import { CalendarEventType } from "@/types";
import React from "react";

export default async function Page() {
  const data = await getEvents();
  return (
    <div className="">
      <YearlyRecap events={data.events as unknown as CalendarEventType[]} />
    </div>
  );
}
