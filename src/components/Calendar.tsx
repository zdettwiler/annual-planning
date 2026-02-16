import MonthRow from "@/components/MonthRow";

interface CalendarProps {
  year: number;
}

export default function Calendar({ year }: CalendarProps) {
  return (
    <div className="w-full h-full divide-y divide-gray-200 flex flex-col">
      {[...Array(12)].map((e, i) => (
        <MonthRow key={i} year={year} month={i} />
      ))}
    </div>
  );
}
