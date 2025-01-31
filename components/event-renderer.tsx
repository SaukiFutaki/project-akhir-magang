import { useEventStore } from "@/lib/store";
import { CalendarEventType } from "@/types";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { ScrollArea } from "./ui/scroll-area";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  className?: string;
};

// Define color variants for badges
const eventColors = [
  "bg-blue-500 hover:bg-blue-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-teal-500 hover:bg-teal-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-emerald-500 hover:bg-emerald-600",
  "bg-cyan-500 hover:bg-cyan-600",
  "bg-violet-500 hover:bg-violet-600",
];

export function EventRenderer({
  date,
  view,
  events,
  className,
}: EventRendererProps) {
  const { openEventSummary } = useEventStore();

  // Use event ID to consistently assign the same color to the same event
  const getEventColor = (eventId: string) => {
    const colorIndex =
      Math.abs(
        eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % eventColors.length;
    return eventColors[colorIndex];
  };

  const filteredEvents = events.filter((event: CalendarEventType) => {
    if (view === "month") {
      return event.date.format("DD-MM-YY") === date.format("DD-MM-YY");
    } else if (view === "week" || view === "day") {
      return event.date.format("DD-MM-YY HH") === date.format("DD-MM-YY HH");
    }
  });

  return (
    <>
        
        {filteredEvents.map((event) => (
          <Badge
            key={event.id}
            variant="secondary"
            className={`${className} line-clamp-1 mb-1  cursor-pointer text-sm font-normal text-white transition-colors duration-200 ${getEventColor(
              event.id
            )} `}
            onClick={(e) => {
              e.stopPropagation();
              openEventSummary(event);
            }}
          >
            {event.title}
          </Badge>
        ))}
    
    </>
  );
}
