import type { CalendarBlock } from "./types";

function blocksForMonth(year: number, month: number): CalendarBlock[] {
  const blocks: CalendarBlock[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Recurring yoga course: every Tuesday 18:00-19:30
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date.getDay() === 2) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      blocks.push({
        id: `yoga-${iso}`,
        name: "Yoga Basics",
        type: "course",
        startAt: `${iso}T18:00:00`,
        endAt: `${iso}T19:30:00`,
      });
    }
  }

  // Recurring pilates: every Thursday 10:00-11:00
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date.getDay() === 4) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      blocks.push({
        id: `pilates-${iso}`,
        name: "Pilates",
        type: "course",
        startAt: `${iso}T10:00:00`,
        endAt: `${iso}T11:00:00`,
      });
    }
  }

  // A couple of one-time events
  const pad = (n: number) => String(n).padStart(2, "0");
  const m = pad(month + 1);

  blocks.push({
    id: "event-open-day",
    name: "Öppen dag",
    type: "event",
    startAt: `${year}-${m}-15T10:00:00`,
    endAt: `${year}-${m}-15T14:00:00`,
  });

  blocks.push({
    id: "event-workshop",
    name: "Workshop",
    type: "event",
    startAt: `${year}-${m}-22T09:00:00`,
    endAt: `${year}-${m}-22T12:00:00`,
  });

  return blocks;
}

export function getMockBlocks(year: number, month: number): CalendarBlock[] {
  return blocksForMonth(year, month);
}
