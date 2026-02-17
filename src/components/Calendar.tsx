import MonthRow from "@/components/MonthRow";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import getYearEvents from "@/lib/getYearEvents";

interface CalendarProps {
  year: number;
}

export default async function Calendar({ year }: CalendarProps) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  const events = await getYearEvents(session, year);
  // const events = await data.json();
  console.log(events);

  return (
    <div className="divide-y divide-gray-200">
      {[...Array(12)].map((e, i) => (
        <MonthRow key={i} year={year} month={i} events={events} />
      ))}
    </div>
  );
}
