"use client";

import { useDroppable } from "@dnd-kit/react";

interface DayCellProps {
  date: Date;
  month: number;
}

export default function DayCell({ date, month }: DayCellProps) {
  const isToday = date.toDateString() === new Date().toDateString();
  const isWeekend = date.getDay() === 6 || date.getDay() === 0;
  const isThisMonth = date.getMonth() === month;

  // Create a unique ID for this date
  const dateId = date.toLocaleDateString("en-CA"); // trick to get YYYY-MM-DD format
  const { ref, isOver } = useDroppable({
    id: dateId,
  });

  return (
    <div
      ref={ref}
      data={dateId}
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
          {date.getDate()}
        </div>
      )}
    </div>
  );
}
