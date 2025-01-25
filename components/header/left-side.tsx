"use client";

import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDateStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function LeftSide() {
  const todayDate = dayjs();
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
    useDateStore();
  const { selectedView } = useViewStore();

  const handleTodayClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(dayjs().month());
        break;
      case "week":
        setDate(todayDate);
        break;
      case "day":
        setDate(todayDate);
        setMonth(dayjs().month());
        break;
      default:
        break;
    }
  };

  const handlePrevClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex - 1);
        break;
      case "week":
        setDate(userSelectedDate.subtract(1, "week"));
        break;
      case "day":
        setDate(userSelectedDate.subtract(1, "day"));
        break;
      default:
        break;
    }
  };

  const handleNextClick = () => {
    switch (selectedView) {
      case "month":
        setMonth(selectedMonthIndex + 1);
        break;
      case "week":
        setDate(userSelectedDate.add(1, "week"));
        break;
      case "day":
        setDate(userSelectedDate.add(1, "day"));
        break;
      default:
        break;
    }
  };

  const getDisplayDate = () => {
    switch (selectedView) {
      case "month":
        return dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
          "MMMM, YYYY"
        );
      case "day":
        return dayjs(userSelectedDate).format("MMMM D, YYYY");
      case "week":
        const startOfWeek = userSelectedDate.startOf("week");
        const endOfWeek = userSelectedDate.endOf("week");
        return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
          "MMM D, YYYY"
        )}`;
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Sidebar Toggle and Calendar Icon */}
      <div className="hidden items-center lg:flex">
        <Button variant="ghost" className="rounded-full p-2">
          <Menu className="size-6" />
        </Button>
        <Image
          src={`/calendar/calendar_${todayDate.date().toString()}.svg`}
          width={40}
          height={40}
          alt="icon"
        />
        <h1 className={`${roboto.className} text-xl font-bold mx-3`}>
          DPU Calendar
        </h1>
      </div>

      {/* Today Button */}
      <Button variant="outline" onClick={handleTodayClick}>
        Today
      </Button>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <MdKeyboardArrowLeft
          className="size-6 cursor-pointer font-bold hover:bg-gray-200 hover:opacity-75 rounded-full"
          onClick={handlePrevClick}
        />
        <MdKeyboardArrowRight
          className="size-6 cursor-pointer font-bold hover:bg-gray-200 hover:opacity-75 rounded-full"
          onClick={handleNextClick}
        />
      </div>

      {/* Current Month and Year Display */}
      <h1 className="hidden text-xl lg:block">{getDisplayDate()}</h1>
    </div>
  );
}
