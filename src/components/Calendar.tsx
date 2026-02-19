"use client";

import { DragDropProvider } from "@dnd-kit/react";

import MonthRow from "@/components/MonthRow";
import moment from "moment";

interface CalendarProps {
  year: number;
  events: [];
}

export default function Calendar({ year, events }: CalendarProps) {
  return (
    <DragDropProvider
      onDragStart={({ operation }) => {
        console.log("Started dragging", operation.source?.id);
      }}
      onDragOver={(event) => {
        console.log(
          `${event.operation.source?.id} is over ${event.operation.target?.id}`,
        );

        const eventBar = event.operation.source?.element;
        const rect = eventBar.getBoundingClientRect();

        const cursorX = event.operation.position.current.x;
        const offsetPx = cursorX - rect.left;

        // difference in milliseconds
        const calendarEvent = events.find(
          (e) => e.id === event.operation.source?.id,
        );
        const eventDurationMs =
          new Date(calendarEvent.end) - new Date(calendarEvent.start);

        // convert to days
        const eventDurationDays = eventDurationMs / (1000 * 60 * 60 * 24);

        console.log("eventDurationDays", eventDurationDays);

        const dayWidth = rect.width / eventDurationDays;

        const dragOffsetDays = Math.floor(offsetPx / dayWidth);

        const newStartDate = moment(calendarEvent.start).subtract(
          dragOffsetDays,
          "days",
        );
        console.log("newStartDate", newStartDate.format());
      }}
    >
      <div className="divide-y divide-gray-200">
        {[...Array(12)].map((e, i) => (
          <MonthRow key={i} year={year} month={i} events={events} />
        ))}
      </div>
    </DragDropProvider>
  );
}
