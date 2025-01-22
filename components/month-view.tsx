"use client";
import { getMonth } from "@/lib/get-time";
import React, { Fragment } from "react";
import MonthViewBox from "./month-view-box";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export default function MonthView() {
  const currentMonth = getMonth();

  return (
    <div>
         <div className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div key={day} className="p-2 text-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <section className="grid grid-cols-7 grid-rows-5 lg:h-[100vh]">
        {currentMonth.map((row, idx) => (
          <Fragment key={idx}>
            {row.map((day, idx) => (
              <MonthViewBox key={idx} day={day} rowIndex={idx} />
            ))}
          </Fragment>
        ))}
      </section>
    </div>
  );
}
