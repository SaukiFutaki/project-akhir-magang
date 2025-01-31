import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

export const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.isSame(dayjs(), "day");
};

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDayofMonth = dayjs().set("month", month).startOf("month").day();

  let dayCounter = -firstDayofMonth;

  return Array.from({ length: 5 }, () =>
    Array.from({ length: 7 }, () => dayjs(new Date(year, month, ++dayCounter)))
  );
};

export const getWeekDays = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week");

  const weekDates = [];

  // Loop melalui 7 hari dalam seminggu
  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.add(i, "day");
    weekDates.push({
      currentDate,
      today:
        currentDate.toDate().toDateString() === dayjs().toDate().toDateString(),
      isCurrentDay,
    });
  }

  return weekDates;
};

export const getHours = Array.from({ length: 24 }, (_, i) =>
  dayjs().startOf("day").add(i, "hour")
);

// Fungsi untuk membuat minggu dalam bulan secara dinamis

export const getWeeks = (monthIndex: number) => {
  const year = dayjs().year();
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1));
  const lastDayOfMonth = dayjs(new Date(year, monthIndex + 1, 0)); // Hari terakhir dalam bulan

  const weeks: number[] = [];

  // Loop dari hari pertama hingga hari terakhir dalam bulan
  let currentDay = firstDayOfMonth;
  while (
    currentDay.isBefore(lastDayOfMonth) ||
    currentDay.isSame(lastDayOfMonth)
  ) {
    const weekNumber = currentDay.week(); //Ini memerlukan plugin WeekOfYear seperti yang diimpor di atas
    if (!weeks.includes(weekNumber)) {
      weeks.push(weekNumber);
    }
    currentDay = currentDay.add(1, "day"); // Pindah ke hari berikutnya
  }

  return weeks;
};

export const getYears = (startYear = dayjs().year() - 4, endYear = dayjs().year() + 5) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};