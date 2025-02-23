"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarEventType } from "@/types";
import dayjs from "dayjs";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Search,
  Share2,
} from "lucide-react";
import React from "react";

interface YearlyRecapProps {
  events: CalendarEventType[];
}

const monthNames = [
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

export default function YearlyRecap({ events }: YearlyRecapProps) {
  const [selectedEvent, setSelectedEvent] =
    React.useState<CalendarEventType | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const eventsByMonth = monthNames.map((monthName, index) => {
    const monthEvents = events
      .filter((event) => dayjs(event.date).month() === index)
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    return {
      month: monthName,
      events: monthEvents,
    };
  });

  const handleEventClick = (event: CalendarEventType) => {
    setSelectedEvent(event);
    setSheetOpen(true);
    setSearchOpen(false);
  };

  // Group all events by month for search
  const allEvents = events.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getEventColor = (eventId: string) => {
    const colorIndex =
      eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      eventColors.length;

    return eventColors[colorIndex];
  };
  return (
    <div className="p-4 min-h-screen bg-zinc-950">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-100">
          Rekap Event Tahunan {dayjs().year()}
        </h2>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 
            bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Cari event...</span>
          <kbd className="ml-2 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
            ctrl + K
          </kbd>
        </button>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {eventsByMonth.map(({ month, events }) => (
            <Card key={month} className={`bg-zinc-900 border-zinc-800  `}>
              <CardHeader className="py-3 px-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-zinc-100">
                    {month}
                  </CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                    {events.length} event{events.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <ScrollArea className="h-80 w-full">
                <CardContent className={`p-3`}>
                  {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Calendar className="w-8 h-8 text-zinc-700 mb-2" />
                      <p className="text-sm text-zinc-500">Tidak ada event</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`w-full text-left p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 
                          border border-zinc-700 transition-colors duration-200 group   border-l-4  ${getEventColor(
                            event.id
                          )}`}
                        >
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-zinc-100 leading-tight group-hover:text-white">
                              {event.title}
                            </h3>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                  {dayjs(event.date).format("DD MMM")} -{" "}
                                  {event.time}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="text-xs ">
                                    {event.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Cari event..." />
        <CommandList>
          <CommandEmpty>Tidak ada event yang ditemukan.</CommandEmpty>
          <CommandGroup heading="Events">
            <ScrollArea className="h-48">
              {allEvents.map((event) => (
                <CommandItem
                  key={event.id}
                  onSelect={() => handleEventClick(event)}
                  className="flex items-start gap-2 p-2"
                >
                  <CalendarDays className="w-4 h-4 mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span>{event.title}</span>
                    <span className="text-xs text-zinc-400">
                      {dayjs(event.date).format("DD MMM YYYY")} - {event.time}
                    </span>
                    {event.location && (
                      <span className="text-xs text-zinc-500 truncate">
                        {event.location}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-zinc-100">
                  {selectedEvent.title}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm">
                        {dayjs(selectedEvent.date).format("DD MMMM YYYY")}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3 text-zinc-300">
                      <MapPin className="w-5 h-5" />
                      <p className="text-sm">{selectedEvent.location}</p>
                    </div>
                  )}
                  {/* {selectedEvent.organizer && (
                    <div className="flex items-center gap-3 text-zinc-300">
                      <UserCircle className="w-5 h-5" />
                      <p className="text-sm">{selectedEvent.organizer}</p>
                    </div>
                  )} */}
                </div>

                {selectedEvent.description && (
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-300">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
                    bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Bagikan Event</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
