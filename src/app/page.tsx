import CalendarView from "@/components/CalendarView";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import getYearEvents from "@/lib/getYearEvents";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const year = 2026;
  const initEvents = await getYearEvents(session, year);

  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans dark:bg-black p-5">
      <CalendarView year={year} initEvents={initEvents} />
    </div>
  );
}
