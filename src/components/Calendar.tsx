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
      onDragEnd={({ operation }) => {
        const eventId = operation.source?.id;
        const newDate = operation.target?.id;
        console.log("event", eventId, "date", newDate);
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
