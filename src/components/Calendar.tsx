"use client";

import { DragDropProvider } from "@dnd-kit/react";
import moment from "moment";
import MonthRow from "@/components/MonthRow";
import patchEvent from "@/lib/patchEvent";

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
      onDragEnd={({ operation }) => {
        const eventId = operation.source?.id;
        const newDroppedStartDate = moment(operation.target?.id);

        const event = events.find((e) => e.id === eventId);

        const newStartDate = moment(event.start)
          .clone()
          .year(newDroppedStartDate.year())
          .month(newDroppedStartDate.month())
          .date(newDroppedStartDate.date());

        const newEndDate = moment(newStartDate).add(event.duration);

        if (event.isAllDay) {
          patchEvent({
            ...event,
            start: newStartDate.format("YYYY-MM-DD"),
            end: newEndDate.format("YYYY-MM-DD"),
          });
        } else {
          patchEvent({
            ...event,
            start: newStartDate.format(),
            end: newEndDate.format(),
          });
        }
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
