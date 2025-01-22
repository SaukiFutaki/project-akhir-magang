
import MonthView from "./month-view";
import Sidebar from "./sidebar/sidebar";

export default function MainView() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="w-full flex-1  ">
        <MonthView />
      </div>
    </div>
  );
}
