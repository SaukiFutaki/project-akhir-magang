import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/get-time";
import { EventRenderer } from "./event-renderer";
import { Separator } from "./ui/separator";

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

export default function DayView() {
  console.log(getHours)
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  
  const { userSelectedDate, setDate } = useDateStore();



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isToday = userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <div className="flex h-full flex-col">
      <Separator />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="grid grid-cols-[auto_auto_1fr] items-center px-6 py-4">
          <div className="text-sm font-medium text-muted-foreground">
            GMT +07
          </div>
          <div className="ml-8 flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <span className={cn(
                "text-sm font-medium mb-2",
                isToday && "text-blue-600"
              )}>
                {WEEKDAYS[userSelectedDate.day()]}
              </span>
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold",
                isToday ? "bg-blue-600 text-white" : "bg-muted"
              )}>
                {userSelectedDate.format("DD")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr]">
          {/* Time Column */}
          <div className="sticky left-0 w-20 bg-background border-r">
            {getHours.map((hour, index) => (
              <div 
                key={index} 
                className="relative h-16 pr-4"
              >
                <div className="absolute top-6 right-4 text-sm text-muted-foreground">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Events Column */}
          <div className="relative min-w-[200px]">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="group relative h-16 border-b border-muted"
                onClick={() => {
                  setDate(userSelectedDate.hour(hour.hour()));
                   openPopover();
                }}
              >
                <div className="absolute inset-0 flex flex-col gap-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-full w-full rounded hover:bg-muted/50 transition-colors" />
                </div>
                <div
                onClick={(e) => e.stopPropagation()}
                >

                <EventRenderer
                  events={events}
                  date={userSelectedDate.hour(hour.hour())}
                  view="day"
                  style={{
                    height: "calc(100% - 2px)",
                    width: "calc(100% - 2px)",
                    top: 1,
                    left: 1,
                   } }
                  className="relative z-10 w-full"
                  />
                  </div>
              </div>
            ))}

            {/* Current Time Indicator */}
            {isCurrentDay(userSelectedDate) && (
              <div className="absolute left-0 right-0 flex items-center pointer-events-none"
                style={{
                  top: `calc(((${currentTime.hour()} + ${currentTime.minute()} / 60) / 24) * 100%)`,
                }}>
                <div className="w-2 h-2 rounded-full bg-red-500 -translate-x-1"></div>
                <div className="h-px flex-1 bg-red-500"></div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}