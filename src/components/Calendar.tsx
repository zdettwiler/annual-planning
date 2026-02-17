import MonthRow from "@/components/MonthRow";

interface CalendarProps {
  year: number;
  events: [];
}

export default async function Calendar({ year, events }: CalendarProps) {
  return (
    <div className="divide-y divide-gray-200">
      {[...Array(12)].map((e, i) => (
        <MonthRow key={i} year={year} month={i} events={events} />
      ))}
    </div>
  );
}
