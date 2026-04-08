"use client";

import { useState } from "react";
import { CalendarDay } from "./CalendarDay";
import { getMockBlocks } from "./mock-data";
import type { CalendarBlock } from "./types";

const DAY_NAMES = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const MONTH_NAMES = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];

function getCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Convert Sunday=0 to Monday-based: Mon=0..Sun=6
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; isOutside: boolean }[] = [];

  // Previous month trailing days
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isOutside: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isOutside: false });
  }

  // Next month leading days
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - startWeekday + 1, isOutside: true });
  }

  return cells;
}

function blocksByDay(blocks: CalendarBlock[]): Map<number, CalendarBlock[]> {
  const map = new Map<number, CalendarBlock[]>();
  for (const b of blocks) {
    const day = parseInt(b.startAt.slice(8, 10), 10);
    const existing = map.get(day);
    if (existing) {
      existing.push(b);
    } else {
      map.set(day, [b]);
    }
  }
  return map;
}

export function MonthCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const cells = getCalendarGrid(year, month);
  const blocks = getMockBlocks(year, month);
  const byDay = blocksByDay(blocks);

  const today = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;

  function prev() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function next() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prev}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-purple-dark hover:bg-purple-light/10"
          aria-label="Föregående månad"
        >
          ← Förra
        </button>
        <h2 className="text-lg font-bold text-purple-dark sm:text-xl">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          onClick={next}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-purple-dark hover:bg-purple-light/10"
          aria-label="Nästa månad"
        >
          Nästa →
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className="bg-purple-main py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm"
            >
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => (
            <CalendarDay
              key={i}
              day={cell.day}
              isToday={!cell.isOutside && cell.day === today}
              isOutside={cell.isOutside}
              blocks={cell.isOutside ? [] : (byDay.get(cell.day) ?? [])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
