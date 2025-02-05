"use client";

import { useDateStore, useEventStore, useViewStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import DayView from "./day-view";
import MonthView from "./month-view";
import Sidebar from "./sidebar/sidebar";
import WeekView from "./week-view";
import YearView from "./year-view";
import EventPopover from "./event-popover";
import { EventSummaryPopover } from "./event-summary-popover";
import { CalendarEventType } from "@/types";
import { useEffect } from "react";
import dayjs from "dayjs";

interface MainViewProps {
  events: CalendarEventType[];
}

export default function MainView({ events }: MainViewProps) {
  const { selectedView } = useViewStore();
  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();


  useEffect(() => {
    const mappedEvents: CalendarEventType[] = events.map((event) => ({
      id: event.id,
      date: dayjs(event.date),
      time: event.time,
      documentationFile: event.documentationFile,
      documentationUrl: event.documentationUrl,
      title: event.title,
      description: event.description,
    }));

    setEvents(mappedEvents);
  }, [events, setEvents]);
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="w-full flex-1">
        <AnimatePresence mode="wait">
          {selectedView === "month" && (
            <motion.div
              key="month-view"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MonthView />
            </motion.div>
          )}
          {selectedView === "week" && (
            <motion.div
              key="week-view"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WeekView />
            </motion.div>
          )}
          {selectedView === "day" && (
            <motion.div
              key="day-view"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DayView />
            </motion.div>
          )}
          {selectedView === "year" && (
            <motion.div
              key="year-view"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <YearView />
            </motion.div>
          )}
        </AnimatePresence>

        {isPopoverOpen && (
          <EventPopover
            isOpen={isPopoverOpen}
            onClose={closePopover}
            date={userSelectedDate.format("YYYY-MM-DD")}
          />
        )}

        {/* {isEventSummaryOpen && selectedEvent && (
          <EventSummaryPopover
            isOpen={isEventSummaryOpen}
            onClose={closeEventSummary}
            event={selectedEvent}
          />
        )} */}
      </div>
    </div>
  );
}
