"use client";

import { useDateStore, useEventStore, useViewStore } from "@/lib/store";
import { CalendarEventType } from "@/types";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import DayView from "./day-view";
import EventPopover from "./event-popover";
import MonthView from "./month-view";
import Sidebar from "./sidebar/sidebar";
import WeekView from "./week-view";
import YearView from "./year-view";

interface MainViewProps {
  events: CalendarEventType[];
  role : string;
}

export default function MainView({ events,role }: MainViewProps) {
  const { selectedView } = useViewStore();
  const {
    isPopoverOpen,
    closePopover,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();


  useEffect(() => {
    const mappedEvents: CalendarEventType[] = events.map((event) => ({
      id: event.id,
      date: dayjs(event.date),
      time: event.time,
      documentationFiles: event.documentationFiles,
      location: event.location,
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
              <YearView
                role={role}
              />
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
