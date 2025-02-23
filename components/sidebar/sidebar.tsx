"use client"
import { cn } from "@/lib/utils";
import SidebarCalendar from "./sidebar-calendar";
import { useToggleSideBarStore } from "@/lib/store";

export default function Sidebar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  return (
    <aside
      className={cn(
        "w-92 hidden border-t px-2 py-3 transition-all duration-300 ease-in-out lg:block",
        !isSideBarOpen && "lg:hidden"
      )}
    >
      <SidebarCalendar />
    </aside>
  );
}
