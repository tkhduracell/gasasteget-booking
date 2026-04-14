"use server";

import type { CalendarBlock } from "./types";

const DANS_API_URL =
  "https://dans.se/api/json/?org=gasasteget&contentType=calendar&new&lang=sv";

const EVENT_REGEX =
  /<tr class="cwCalendarEvent">\s*<td class="cwDateShort" title="(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})">[^<]*<\/td>\s*<td class="cwStartTime">[^<]*<\/td>\s*<td class="cwFromToSeparator">[^<]*<\/td>\s*<td class="cwEndShort" title="(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})">[^<]*<\/td>\s*<td class="cwEventTitle">([^<]+)<\/td>/g;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchDansEvents(): Promise<CalendarBlock[]> {
  const res = await fetch(DANS_API_URL, { next: { revalidate: 300 } });
  const data = await res.json();
  const html: string = data.htmlBlock ?? "";

  const blocks: CalendarBlock[] = [];
  let match;
  let i = 0;

  while ((match = EVENT_REGEX.exec(html)) !== null) {
    blocks.push({
      id: `dans-${i++}`,
      name: decodeHtmlEntities(match[3].trim()),
      type: "event",
      startAt: match[1].replace(" ", "T"),
      endAt: match[2].replace(" ", "T"),
    });
  }

  return blocks;
}
