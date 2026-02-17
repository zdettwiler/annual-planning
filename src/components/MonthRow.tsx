import DayCell from "@/components/DayCell";
// 'use client'
// import { useContext } from 'react'
// import type { BibleWithLLB } from '@/types'

interface MonthRowProps {
  year: number;
  month: number;
  events: Array<{ id: string; label: string; start: string; end: string }>;
}

export default function MonthRow({ year, month, events }: MonthRowProps) {
  const shortMonthName = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
  }).format(new Date(year, month, 1));

  return (
    <div className="relative grid grid-cols-[30px_1fr] h-16">
      {/* Month label */}
      <div className="flex items-center justify-center font-medium">
        <span className="transform -rotate-90 whitespace-nowrap">
          {shortMonthName}
        </span>
      </div>

      {/* Day grid */}
      <div className="relative grid grid-cols-[repeat(31,minmax(0,1fr))]">
        {[...Array(31)].map((_, i) => (
          <DayCell key={i} date={new Date(year, month, i + 1)} month={month} />
        ))}
      </div>

      {/* Event layer */}
      <div className="absolute left-[30px] right-0 top-0 h-full grid grid-cols-[repeat(31,minmax(0,1fr))] auto-rows-[1rem] pt-5">
        {events
          .filter((e) => new Date(e.start).getMonth() === month)
          .map((e, i) => (
            <div
              key={i}
              className="text-xs/3 text-white bg-blue-500 rounded-md h-3 self-center px-2"
              style={{
                gridColumn: `${new Date(e.start).getDate()} / ${new Date(e.end).getDate()}`,
                gridRow: 1,
              }}
            >
              <span className=" ">{e.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
