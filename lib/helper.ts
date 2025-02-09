import { eventColors } from "./constant";

export const getEventColor = (eventId: string) => {
    const colorIndex =
      eventId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      eventColors.length;

    return eventColors[colorIndex];
  };