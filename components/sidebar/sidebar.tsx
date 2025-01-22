import { cn } from "@/lib/utils";
import React from "react";
import Create from "./create";
import SidebarCalendar from "./sidebar-calendar";
import MyCalendars from "./my-calendar";

export default function Sidebar() {
  return (
    <aside
      className={cn(
        "w-92 hidden border-t px-2 py-3 transition-all duration-300 ease-in-out lg:block"
      )}
    >
      <Create />
      <SidebarCalendar />
      <MyCalendars />
    </aside>
  );
}
