"use client";

import { useDateStore } from "@/lib/store";
import { Fragment } from "react";
import MonthViewBox from "./month-view-box";

export default function MonthView() {
  const { twoDMonthArray } = useDateStore();

  return (
    <div>
      <section className="grid grid-cols-7 grid-rows-5 lg:h-[100vh]">
        {twoDMonthArray.map((row, idx) => (
          <Fragment key={idx}>
            {row.map((day, idx) => (
              <MonthViewBox
                key={idx}
                day={day}
                rowIndex={idx}
                collIndex={idx}
              />
            ))}
          </Fragment>
        ))}
      </section>
    </div>
  );
}
