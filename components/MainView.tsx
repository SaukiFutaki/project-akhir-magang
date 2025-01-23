"use client";

import { useViewStore } from "@/lib/store";
import MonthView from "./month-view";
import Sidebar from "./sidebar/sidebar";
import WeekView from "./week-view";
import DayView from "./day-view";

export default function MainView() {
    const {selectedView} = useViewStore();
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="w-full flex-1  ">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
    </div>
  );
}
