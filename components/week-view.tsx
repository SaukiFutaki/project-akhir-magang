import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";
import { Separator } from "./ui/separator";
import { getHours, getWeekDays } from "@/lib/get-time";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const {  openPopover,events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Separator />
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-4">
          {/* Timezone indicator */}
          <div className="text-sm font-medium text-muted-foreground">
            GMT +07
          </div>

          {/* Week days header */}
          {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <span className={cn(
                "text-sm font-medium mb-2",
                today && "text-blue-600"
              )}>
                {WEEKDAYS[currentDate.day()]}
              </span>
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold",
                today ? "bg-blue-600 text-white" : "bg-muted"
              )}>
                {currentDate.format("DD")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Time Column */}
          <div className="sticky left-0 w-20 bg-background border-r">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16 pr-4">
                <div className="absolute top-6 right-4 text-sm text-muted-foreground">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Grid */}
          {getWeekDays(userSelectedDate).map(({ isCurrentDay, today }, index) => {
            const dayDate = userSelectedDate.startOf("week").add(index, "day");

            return (
              <div key={index} className="relative min-w-[100px] border-r border-muted">
                {getHours.map((hour, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setDate(dayDate.hour(hour.hour()));
                      openPopover();
                    }}
                    className="group relative h-16 border-b border-muted"
                  >
                    <div className="absolute inset-0 flex flex-col gap-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-full w-full rounded hover:bg-muted/50 transition-colors" />
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                    >

                    <EventRenderer
                      events={events}
                      date={dayDate.hour(hour.hour())}
                      view="week"
                      style={{
                        height: "calc(100% - 2px)",
                        width: "calc(100% - 2px)",
                        top: 1,
                        left: 1,
                      }}
                      className="relative z-10 w-full"
                      />
                      </div>
                  </div>
                ))}

                {/* Current time indicator */}
                {isCurrentDay(dayDate) && today && (
                  <div 
                    className="absolute left-0 right-0 flex items-center pointer-events-none"
                    style={{
                      top: `calc(((${currentTime.hour()} + ${currentTime.minute()} / 60) / 24) * 100%)`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -translate-x-1" />
                    <div className="h-px flex-1 bg-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}