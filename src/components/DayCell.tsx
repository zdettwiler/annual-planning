"use client";

import { useDroppable, type CollisionDetector } from "@dnd-kit/react";

interface DayCellProps {
  date: Date;
  month: number;
}

// Custom collision detector: checks which droppable (day cell) is hovered by top left corner of event bar
const topLeftCollision: CollisionDetector = ({ dragOperation, droppable }) => {
  const draggableEl = dragOperation.source.element;
  const droppableEl = droppable.element;

  if (!draggableEl || !droppableEl) return null;

  const draggableRect = draggableEl.getBoundingClientRect();
  const droppableRect = droppableEl.getBoundingClientRect();

  const { left, top } = draggableRect;

  const isWithin =
    left >= droppableRect.left &&
    left <= droppableRect.right &&
    top >= droppableRect.top &&
    top <= droppableRect.bottom;

  if (!isWithin) return null;

  return { id: droppable.id };
};

export default function DayCell({ date, month }: DayCellProps) {
  const isToday = date.toDateString() === new Date().toDateString();
  const isWeekend = date.getDay() === 6 || date.getDay() === 0;
  const isThisMonth = date.getMonth() === month;
  const shortDayName = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
  }).format(date);

  // Create a unique ID for this date
  const dateId = date.toLocaleDateString("en-CA"); // trick to get YYYY-MM-DD format
  const { ref, isOver } = useDroppable({
    id: dateId,
    collisionDetector: topLeftCollision,
  });

  return (
    <div
      ref={ref}
      className={`p-1 border-l border-gray-200 text-xs transition-colors
        ${!isThisMonth ? "bg-gray-200" : ""}
        ${isWeekend ? "bg-blue-100" : ""}
        ${isOver ? "bg-green-200" : ""}`}
    >
      {isThisMonth && (
        <div
          className={`self-start size-5 font-semibold rounded-full flex items-center justify-center
        ${isToday ? "bg-red-500 text-white" : ""}`}
        >
          <span>{date.getDate()}</span>
        </div>
      )}
    </div>
  );
}
