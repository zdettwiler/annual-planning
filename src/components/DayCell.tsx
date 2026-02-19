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

  return (
    <div
      className={`p-1 border-l border-gray-200 text-xs
        ${!isThisMonth ? "bg-gray-200" : ""}
        ${isWeekend ? "bg-blue-100" : ""}`}
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
