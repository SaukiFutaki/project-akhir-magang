"use client";

import { useDateStore, useToggleSideBarStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Roboto } from "next/font/google";
import Image from "next/image";
import { Button } from "../ui/button";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";



dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Jakarta");


const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});


export default function LeftSide() {
  const todayDate = dayjs().tz("Asia/Jakarta");
  const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
    useDateStore();
  const { selectedView } = useViewStore();
  const { setSideBarOpen } = useToggleSideBarStore();

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
      case "year":
        setDate(userSelectedDate.subtract(1, "year"));
        break;
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
      case "year":
        setDate(userSelectedDate.add(1, "year"));
        break;
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
      case "year":
        return dayjs(userSelectedDate).format("YYYY");
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Sidebar Toggle and Calendar Icon */}
      <div className="hidden items-center lg:flex">
        <Button
          variant="ghost"
          className="rounded-full p-2"
          onClick={() => setSideBarOpen()}
        >
          <Menu className="size-6" />
        </Button>
        <Image
          src={`/calendar/calendar_${todayDate.date().toString()}.svg`}
          width={40}
          height={40}
          alt="icon"
        />
      
        <h1 className={`${roboto.className} text-xl font-bold mx-3`}>
          Kalender DPU BMCK
        </h1>
      </div>

      {/* Today Button */}
      <Button variant="outline" onClick={handleTodayClick}>
        Hari Ini
      </Button>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={handlePrevClick}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextClick}>
          <ChevronRight />
        </Button>
        {/* <MdKeyboardArrowLeft
          className="size-6 cursor-pointer font-bold hover:bg-gray-200 hover:opacity-75 rounded-full dark:hover:bg-secondary"
          onClick={handlePrevClick}
        /> */}
        {/* <MdKeyboardArrowRight className="size-6 cursor-pointer font-bold hover:bg-gray-200 hover:opacity-75 rounded-full dark:hover:bg-secondary" /> */}
      </div>

      {/* Current Month and Year Display */}
      <h1 className="hidden text-xl lg:block">{getDisplayDate()}</h1>
    </div>
  );
}
