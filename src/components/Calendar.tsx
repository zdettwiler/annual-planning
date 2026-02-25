"use client";

import { useState } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import moment from "moment";
import MonthRow from "@/components/MonthRow";
import patchEvent from "@/lib/patchEvent";

interface CalendarProps {
  year: number;
  events: [];
  mutate: Function;
}

export default function Calendar({ year, events, mutate }: CalendarProps) {
  const [activeId, setActiveId] = useState(null);

  return (
    <DragDropProvider
      onDragStart={({ operation }) => {
        console.log("Started dragging", operation.source?.id);
        setActiveId(operation.source?.id);
      }}
      onDragEnd={async ({ operation }) => {
        setActiveId(null);
        const eventId = operation.source?.id;
        const newDroppedStartDate = moment(operation.target?.id);

        const eventToUpdate = events.find((e) => e.id === eventId);

        const newStartDate = moment(eventToUpdate.start)
          .clone()
          .year(newDroppedStartDate.year())
          .month(newDroppedStartDate.month())
          .date(newDroppedStartDate.date())
          .format(eventToUpdate.isAllDay ? "YYYY-MM-DD" : undefined);

        const newEndDate = moment(newStartDate)
          .add(eventToUpdate.duration)
          .format(eventToUpdate.isAllDay ? "YYYY-MM-DD" : undefined);

        const updatedEvent = {
          ...eventToUpdate,
          start: newStartDate,
          end: newEndDate,
        };

        await mutate(
          async (current) => {
            const serverUpdatedEvent = await patchEvent(updatedEvent);

            return current.map((e) =>
              e.id === serverUpdatedEvent.id ? serverUpdatedEvent : e,
            );
          },
          {
            optimisticData: events.map((e) =>
              e.id === updatedEvent.id ? updatedEvent : e,
            ),
            rollbackOnError: true,
            revalidate: false,
          },
        );
        console.log("updated event on Google Calendar", updatedEvent.start);
      }}
    >
      <div className="divide-y divide-gray-200">
        {[...Array(12)].map((e, i) => (
          <MonthRow key={i} year={year} month={i} events={events} />
        ))}
        {/* <DragOverlay>
          {activeId ? <div>{`Item ${activeId}`}</div> : null}
        </DragOverlay> */}
      </div>
    </DragDropProvider>
  );
}
