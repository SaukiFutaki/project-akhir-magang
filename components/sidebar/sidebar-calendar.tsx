import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWeeks } from "@/lib/get-time";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Clock, MapPin } from "lucide-react";
import { Fragment } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const WEEKDAYS = ["M", "S", "S", "R", "K", "J", "S"];

const eventColors = [
  "border-l-blue-600",
  "border-l-purple-500",
  "border-l-pink-500",
  "border-l-orange-500",
  "border-l-teal-500",
  "border-l-indigo-500",
  "border-l-rose-500",
  "border-l-emerald-500",
  "border-l-cyan-500",
  "border-l-violet-500",
];

export default function SideBarCalendar() {
  const {
    setDate,
    setMonth,
    selectedMonthIndex,
    twoDMonthArray,
    userSelectedDate,
  } = useDateStore();

  const {  events } = useEventStore();
  const today = dayjs();

  const handleDayClick = (date: dayjs.Dayjs) => {
    setDate(date);
  };

  const weeksOfMonth = getWeeks(selectedMonthIndex);

  const isDaySelected = (day: dayjs.Dayjs) => {
    return day.format("YYYY-MM-DD") === userSelectedDate.format("YYYY-MM-DD");
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");
  };

  const getEventColor = (eventId: string) => {
    const colorIndex =
      eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      eventColors.length;
    return eventColors[colorIndex];
  };

  // Filter events for current month
  const currentMonthEvents = events.filter(
    (event) => dayjs(event.date).month() === selectedMonthIndex
  );

  return (
    <div className="space-y-6">
  <div className="my-6 p-2 font-mono">
      <div className="flex items-center justify-between">
        <h4 className="text-sm">
          {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
            "MMMM YYYY"
          )}
        </h4>
        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            className="size-5 cursor-pointer font-bold"
            onClick={() => setMonth(selectedMonthIndex - 1)}
          />
          <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold"
            onClick={() => setMonth(selectedMonthIndex + 1)}
          />
        </div>
      </div>

      {/* Header Row: Days of the Week */}
      <div className="mt-2 grid grid-cols-[auto_1fr]">
        <div className="w-6"></div>
        <div className="grid grid-cols-7 text-xs bg-gray-100 dark:bg-primary p-1 rounded-sm">
          {WEEKDAYS.map((day, i) => (
            <span
              key={i}
              className="flex h-5 w-5 items-center justify-center text-black"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content: Weeks and Days */}
      <div className="mt-2 grid grid-cols-[auto_1fr] text-xs">
        {/* Week Number column */}
        <div className="grid w-6 grid-rows-5 gap-1 gap-y-3 rounded-sm bg-gray-100 p-1 dark:bg-[#131314]">
          {weeksOfMonth.slice(0, 5).map((week, i) => (
            <span key={i} className="flex h-5 w-5 items-center justify-center">
              {week}
            </span>
          ))}
        </div>

        {/* Dates grid */}
        <div className="grid grid-cols-7 grid-rows-5 gap-1 gap-y-3 rounded-sm p-1 text-xs">
          {twoDMonthArray.map((row, i) => (
            <Fragment key={i}>
              {row.map((day, index) => (
                <button
                  onClick={() => handleDayClick(day)}
                  key={index}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full transition-colors",
                    isToday(day) && "bg-blue-600 text-white hover:bg-blue-700",
                    isDaySelected(day) && !isToday(day) && "bg-gray-300 text-black hover:bg-gray-400",
                    !isToday(day) && !isDaySelected(day) && "hover:bg-gray-200"
                  )}
                >
                  <span>{day.format("D")}</span>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>

      {/* Events Section */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 px-2">
          {currentMonthEvents.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Tidak ada event pada bulan ini
            </div>
          ) : (
            currentMonthEvents.map((event) => (
              <Card
                key={event.id}
                className={cn("border-l-4", getEventColor(event.id))}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        {dayjs(event.date).format("DD MMM")} - {event.time}
                      </span>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{event.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
