import React from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useDateStore, useEventStore, useViewStore } from "@/lib/store";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

export default function YearView() {
  const { userSelectedDate, setDate } = useDateStore();
  const { events } = useEventStore();
  const { setView } = useViewStore();
  const currentYear = userSelectedDate.year();

  const getMonthData = (year: number, month: number) => {
    const firstDayOfMonth = dayjs(new Date(year, month, 1));
    const firstDayOfWeek = firstDayOfMonth.day();
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const lastMonthDays = firstDayOfMonth.subtract(1, "month").daysInMonth();

    const days = [];
    let currentWeek = [];

    // Add days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = lastMonthDays - firstDayOfWeek + i + 1;
      const date = firstDayOfMonth
        .subtract(1, "month")
        .set("date", prevMonthDay);
      currentWeek.push({ date, isCurrentMonth: false });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(new Date(year, month, day));
      currentWeek.push({ date, isCurrentMonth: true });

      if (currentWeek.length === 7) {
        days.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add days from next month
    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        const date = firstDayOfMonth
          .add(1, "month")
          .set("date", nextMonthDay++);
        currentWeek.push({ date, isCurrentMonth: false });
      }
      days.push(currentWeek);
    }

    return days;
  };

  const isCurrentDay = (date: dayjs.Dayjs) => {
    return date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  };

  const isSelectedDay = (date: dayjs.Dayjs) => {
    return date.format("YYYY-MM-DD") === userSelectedDate.format("YYYY-MM-DD");
  };

  const hasEvents = (date: dayjs.Dayjs) => {
    return events.some(
      (event) =>
        dayjs(event.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    setDate(date);
    setView("day");
  };

  return (
    <div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-4 gap-6 p-6">
          {MONTHS.map((monthName, monthIndex) => (
            <div key={monthIndex} className="flex flex-col">
              {/* Month Header */}
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                {monthName}
              </h3>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="xl:text-[0.65rem] font-medium text-muted-foreground text-center text-[0.45rem]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-muted">
                {getMonthData(currentYear, monthIndex)
                  .flat()
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateClick(item.date)}
                      className={cn(
                        "aspect-square flex items-center justify-center  relative   border dark:border-none ",
                        "hover:bg-muted/50 transition-colors",
                        "bg-background",
                        !item.isCurrentMonth && "opacity-30",
                        isCurrentDay(item.date) &&
                          "bg-blue-600 text-white hover:bg-blue-500",
                        isSelectedDay(item.date) &&
                          !isCurrentDay(item.date) &&
                          "bg-muted-foreground/20"
                      )}
                    >
                      <span className="text-[0.62rem] text-muted-foreground xl:text-[0.75rem] font-bold">
                        {item.date.date()}
                      </span>
                      {/* Event Indicator ren */}
                      {hasEvents(item.date) && (
                        <div
                          className={cn(
                            "absolute bottom-0 left-1/2 -translate-x-1/2 xl:w-1 xl:h-1 rounded-full w-[3px] h-[3px] xl:bottom-1",
                            isCurrentDay(item.date) ? "bg-white" : "bg-blue-600"
                          )}
                        />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
