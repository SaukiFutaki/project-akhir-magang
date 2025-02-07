import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deleteEvent } from "@/lib/actions";
import { CalendarEventType } from "@/types";
import dayjs from "dayjs";
import { Edit, FileText, Loader2, Trash } from "lucide-react"; // Icons untuk detail event
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Days, Months } from "@/lib/constant";

type EventRendererProps = {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day" | "year"
  events: CalendarEventType[];
  className?: string;
  time?: string;
  style?: React.CSSProperties;
};

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
  style,
}: EventRendererProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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

  const deleteE = async (event: CalendarEventType) => {
    startTransition(() => {
      deleteEvent(event.id);
      toast({
        description: "Berhasil menghapus event",
      });
    });
    router.refresh();
  };

  return (
    <div style={style}>
      {filteredEvents.map((event) => (
        <Sheet key={event.id}>
          <SheetTrigger className="w-full items-center flex justify-center">
            <Badge
              variant="secondary"
              className={`${className} line-clamp-1 mb-1 cursor-pointer text-sm font-normal text-white transition-colors duration-200 ${getEventColor(
                event.id
              )}`}
            >
              {event.title}
            </Badge>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {event.title}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                {Days[event.date.day()]}, {event.date.format("DD")}{" "}
                {Months[event.date.month()]} {event.date.format("YYYY")} •{" "}
                <span className="italic">Waktu ditambahkan: {event.time}</span>
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="space-y-6">
                {/* Deskripsi Event */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
                  <Card className="p-4">
                    <p>{event.description}</p>
                  </Card>
                </div>

                {/* Dokumen Terkait */}
                {event.documentationUrl || event.documentationFiles ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Dokumen</h3>
                    <Card className="p-4">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-medium">File Terlampir</p>
                          {event.documentationUrl && (
                            <Link
                              href={event.documentationUrl}
                              passHref
                              className="text-blue-500 hover:underline"
                            >
                              URL Dokumentasi
                            </Link>
                          )}
                          
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : null}
              </div>
            </ScrollArea>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <Edit />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteE(event)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Trash />}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
