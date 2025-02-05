/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { use } from "react";
import { Badge } from "./ui/badge";
import { EventRenderer } from "./event-renderer";
import { ScrollArea } from "./ui/scroll-area";

interface MonthViewBoxProps {
  day: dayjs.Dayjs | null;
  rowIndex: number;
  collIndex: number;
}

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

export default function MonthViewBox({
  day,
  rowIndex,
  collIndex,
}: MonthViewBoxProps) {
  const { setDate,userSelectedDate } = useDateStore();
  const { openPopover, events } = useEventStore();

  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  const isFirstDayOfMonth = day.date() === 1;
  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-event-container]")) {
      return;
    }
    e.preventDefault();
    setDate(day);
    openPopover();
  };
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-y-2 border dark:bg-[#131314] cursor-pointer",
        "transition-all hover:bg-violet-50 dark:hover:bg-secondary"
      )}
      onClick={handleClick}
    >
      <div>
        <div className="flex flex-col items-center pt-2 mb-1">
          <h4 className="text-xs text-gray-500 mb-[2px]">
            {WEEKDAYS[day.day()]}
          </h4>
          <h4
            className={cn(
              "text-center text-xl",
              userSelectedDate.format("DD-MM-YY") === day.format("DD-MM-YY") && "flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-black",
              isToday &&
                "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
            )}
          >
            {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
          </h4>
        </div>

        <ScrollArea className="h-24">
          <div data-event-container
          onClick={(e) => e.stopPropagation()}
          >
            <EventRenderer
              date={day}
              view="month"
              events={events}
              className=" md:w-[130px] lg:w-[170px]"
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

{
  /* <div
className={cn(
  "group relative flex flex-col items-center gap-y-2 border",
  "transition-all hover:bg-violet-50"
)}
>
<div className="flex flex-col items-center pt-2">
  <h4 className="text-xs text-gray-500 mb-1">{WEEKDAYS[day.day()]}</h4>
   index = {rowIndex}
  <h4
  
    className={cn(
      "text-center text-sm",
      isToday &&
        "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
    )}
  >
    {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
  </h4>
  <span className="text-xs"></span>
</div>
</div> */
}
