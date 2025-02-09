/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteEvent } from "@/lib/actions";
import { borderLeftColors, Months } from "@/lib/constant";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CalendarEventType } from "@/types";
import dayjs from "dayjs";
import {
  AlertCircle,
  CalendarIcon,
  Clock,
  Diff,
  ExternalLink,
  FileText,
  ImageIcon,
  Link2,
  MapPin,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const WEEKDAYS = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
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

export default function YearView({ role }: { role: string }) {
  const { userSelectedDate, setDate } = useDateStore();
  const currentYear = userSelectedDate.year();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<
    CalendarEventType[]
  >([]);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { toast } = useToast();

  const { openPopover, events } = useEventStore();
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

  const getEventsForDate = (date: dayjs.Dayjs) => {
    return events.filter(
      (event) =>
        dayjs(event.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    setDate(date);
    const dateEvents = getEventsForDate(date);
    setSelectedDateEvents(dateEvents);
    setIsSheetOpen(true);
  };

  const del = async (event: CalendarEventType) => {
    startTransition(() => {
      deleteEvent(event.id);
      setIsSheetOpen(false);
      toast({
        description: "Berhasil menghapus event",
      });
    });
    router.refresh();
  };

  const getEventColor = (eventId: string) => {
    const colorIndex =
      eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      eventColors.length;

    return eventColors[colorIndex];
  };

  return (
    <div>
      <Separator />

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-4 gap-6 p-6">
          {Months.map((monthName, monthIndex) => (
            <div key={monthIndex} className="flex flex-col">
              {/* Month Header */}
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground border-b-2 inline-block">
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
                        "aspect-square flex items-center justify-center relative border dark:border-none",
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
                      <span
                        className={cn(
                          "text-[0.62rem] text-muted-foreground xl:text-[0.75rem] font-bold",
                          isCurrentDay(item.date) && "text-white"
                        )}
                      >
                        {item.date.date()}
                      </span>
                      {/* Event Indicator */}
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

      {/* Events Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="space-y-4">
            <SheetTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />

              <span> {userSelectedDate.format("DD MMMM YYYY")}</span>
            </SheetTitle>
            <Button
              onClick={() => {
                openPopover();
                setIsSheetOpen(false);
              }}
              className="flex items-center gap-1 font-bold"
              disabled={role === "user"}
            >
              <Diff className="w-4 h-4" />
              Tambah Event
            </Button>
          </SheetHeader>

          <div className="mt-6">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-background">
                Tidak ada event pada tanggal ini.
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-100px)] pr-4 pb-10 ">
                <div className="space-y-4 mb-1">
                  {selectedDateEvents.map((event, index) => (
                    <Card
                      key={event.id}
                      className={`border-l-4  bg-card overflow-hidden group  ${getEventColor(
                        event.id
                      )}`}
                    >
                      <CardHeader className="space-y-3 pb-3 bg-background">
                        <div className="flex justify-between items-start gap-4">
                          <CardTitle className="text-lg font-semibold break-words">
                            {event.title}
                          </CardTitle>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm whitespace-nowrap">
                                {event.time}
                              </span>
                            </div>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity outline-dashed"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus Event
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus event ini?
                                    Setelah dihapus data akan hilang permanent.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => del(event)}
                                    disabled={role === "user"}
                                    className="bg-destructive hover:bg-destructive/90 text-white"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2 bg-background space-y-4">
                        {/* Location Section */}
                        <div className="space-y-4">
                          {/* Location Section */}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                event.location ? "secondary" : "destructive"
                              }
                              className="w-10 flex justify-start shrink-0 "
                            >
                              <MapPin />
                            </Badge>
                            {event.location ? (
                              <p className="text-sm text-muted-foreground break-words">
                                {event.location}
                              </p>
                            ) : (
                              <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  Tidak ada lokasi
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Description Section */}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                event.description ? "secondary" : "destructive"
                              }
                              className="w-10 flex justify-start shrink-0"
                            >
                              <FileText />
                            </Badge>
                            {event.description ? (
                              <p className="text-sm text-muted-foreground break-words">
                                {event.description}
                              </p>
                            ) : (
                              <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  Tidak ada deskripsi
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Documentation Section */}
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                event.documentationUrl
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="w-10 flex justify-center shrink-0"
                            >
                              <Link2 />
                            </Badge>
                            {event.documentationUrl ? (
                              <Link
                                href={event.documentationUrl}
                                className="flex items-center gap-1.5 text-sm text-blue-500 group"
                              >
                                <span className="group-hover:underline">
                                  Lihat Dokumentasi
                                </span>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            ) : (
                              <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  Tidak ada url dokumentasi
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Documentation Files Section */}
                        {event.documentationFiles &&
                          event.documentationFiles.length > 0 && (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="images">
                                <AccordionTrigger className="text-sm">
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Preview gambar</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {event.documentationFiles.map(
                                      (file, index) => (
                                        <Dialog key={index}>
                                          <DialogTrigger asChild>
                                            <div className="relative aspect-video cursor-pointer group">
                                              <Image
                                                width={200}
                                                height={200}
                                                src={file.url}
                                                alt={`Documentation ${
                                                  index + 1
                                                }`}
                                                className="rounded-md object-cover w-full h-full border-2 border-white transition-all group-hover:opacity-90 group-hover:scale-[1.02]"
                                              />
                                            </div>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-3xl">
                                            <div className="relative aspect-video">
                                              <Image
                                                fill
                                                src={file.url}
                                                alt={`Documentation ${
                                                  index + 1
                                                }`}
                                                className="rounded-md object-contain"
                                              />
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
