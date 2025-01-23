import React from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function LeftSide() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center lg:flex">
        <Button variant={"ghost"} className="rounded-full p-2">
          <Menu className="size-4" />
        </Button>
        <Image src="/tgl-demo.svg" width={36} height={36} alt="icon" className="mx-2" />
        <h1>Calendar</h1>
      </div>

      {/* Today button */}
      <Button variant="outline" className="hidden lg:flex">
        Today
      </Button>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <MdKeyboardArrowLeft
          className="size-6 cursor-pointer font-bold"
          //   onClick={handlePrevClick}
        />
        <MdKeyboardArrowRight
          className="size-6 cursor-pointer font-bold"
          //   onClick={handleNextClick}
        />

        {/* Current Month and Year Display */}
        <h1 className="hidden text-xl lg:block">
          {/* {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
            "MMMM YYYY"
          )} */}
          october 2021
        </h1>
      </div>
    </div>
  );
}
