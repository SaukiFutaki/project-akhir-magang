import { getHours, getWeekDays } from "@/lib/get-time";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";

export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { openPopover, events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center px-4 py-1">
        <div className="w-16 border-r border-gray-300">
          <div className="relative h-16">
            <div className="absolute top-2 text-xs text-gray-600">GMT +2</div>
          </div>
        </div>

        {/* Week View Header */}

        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center "
          >
            <div className={cn("text-sm font-mono uppercase", today && "text-blue-600 ")}>
              {currentDate.format("ddd")}
            </div>
            <div
              className={cn(
                "h-12 w-12 rounded-full p-2 text-2xl",
                today && "bg-blue-600 text-white"
              )}
            >
              {currentDate.format("DD")}{" "}
            </div>
          </div>
        ))}
      </div>

      {/* Time Column & Corresponding Boxes of time per each date  */}

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-1.5">
          {/* Time Column */}
          <div className="w-16 border-r border-gray-300">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-16">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Corresponding Boxes */}

          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf("week")
                .add(index, "day");

              return (
                <div key={index} className="relative border-r border-gray-300">
                  {getHours.map((hour, i) => (
                    <div
                      key={i}
                      className="relative flex h-16 cursor-pointer flex-col items-center gap-y-2 border-b border-gray-300 hover:bg-gray-100"
                      onClick={() => {
                        setDate(dayDate.hour(hour.hour()));
                        openPopover();
                      }}
                    >
                      <EventRenderer
                        events={events}
                        date={dayDate.hour(hour.hour())}
                        view="week"
                      />
                    </div>
                  ))}
                  {/* Current time indicator */}

                  {isCurrentDay(dayDate) && today && (
                    <div
                      className={cn("absolute h-0.5 w-full bg-red-500")}
                      style={{
                        height: "1px",
                        top: `calc(((${currentTime.hour()} + ${currentTime.minute()} / 60) / 24) * 100%)`,
                      }}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </ScrollArea>
    </>
  );
}
