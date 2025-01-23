import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MonthViewBoxProps {
  day: dayjs.Dayjs | null;
  rowIndex: number;
  collIndex: number;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function MonthViewBox({
  day,
  rowIndex,
  collIndex,
}: MonthViewBoxProps) {
  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  const isFirstDayOfMonth = day.date() === 1;
  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "group relative flex flex-col items-center gap-y-2 border",
          "transition-all hover:bg-violet-50"
        )}
      >
        <div>
          <div className="flex flex-col items-center pt-2">
            <h4 className="text-xs text-gray-500 mb-1">
              {WEEKDAYS[day.day()]}
            </h4>
            <h4
              className={cn(
                "text-center text-sm",
                isToday &&
                  "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
              )}
            >
              {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
            </h4>
            <span className="text-xs"></span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{day.format("dddd, MMMM D, YYYY")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>{day.format("dddd, MMMM D, YYYY")}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <div
className={cn(
  "group relative flex flex-col items-center gap-y-2 border",
  "transition-all hover:bg-violet-50"
)}
>
<div className="flex flex-col items-center pt-2">
  <h4 className="text-xs text-gray-500 mb-1">{WEEKDAYS[day.day()]}</h4>
   index = {rowIndex}
  <h4
  
    className={cn(
      "text-center text-sm",
      isToday &&
        "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white"
    )}
  >
    {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
  </h4>
  <span className="text-xs"></span>
</div>
</div> */
}
