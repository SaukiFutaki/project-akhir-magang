import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface ViewStoreType {
  selectedView: string;
  setView: (value: string) => void;
}

export interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;

}

export type EventStore = {
  events: CalendarEventType[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  setEvents: (events: CalendarEventType[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
};

export interface ToggleSideBarType {
  isSideBarOpen: boolean;
  setSideBarOpen: () => void;
}

export type CalendarEventType = {
  id: string;
  title: string;
  date: dayjs.Dayjs;
  time: string;
  location: string | undefined;
  documentationFiles: {
    fullPath : string
    id : string
    path : string
    url : string
  }[]
  description: string;
  documentationUrl: string | undefined;
};
