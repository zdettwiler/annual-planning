import DayCell from "@/components/DayCell";
// 'use client'
// import { useContext } from 'react'
// import type { BibleWithLLB } from '@/types'

interface MonthRowProps {
  year: number;
  month: number;
}

export default function MonthRow({ year, month }: MonthRowProps) {
  const shortMonthName = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
  }).format(new Date(year, month, 1));

  return (
    <div className="w-full h-12 flex-1 flex">
      <div className="w-8 h-full flex items-center justify-center">
        <div className="transform -rotate-90 whitespace-nowrap">
          {shortMonthName}
        </div>
      </div>
      {[...Array(31)].map((e, i) => (
        <DayCell key={i} date={new Date(year, month, i + 1)} />
      ))}
    </div>
  );
}
