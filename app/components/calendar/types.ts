export type CalendarBlock = {
  id: string;
  name: string;
  type: "course" | "event";
  startAt: string;
  endAt: string;
};
