import Image from "next/image";
import Calendar from "@/components/Calendar";
import ProjectsMenu from "@/components/ProjectsMenu";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import getYearEvents from "@/lib/getYearEvents";

export default async function Home() {
  const year = 2026;

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  const events = await getYearEvents(session, year);
  const projects = events.reduce((projects, event) => {
    if (!projects.includes(event.project)) {
      projects.push(event.project);
    }
    return projects;
  }, []);
  console.log(events);

  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans dark:bg-black p-5">
      <ProjectsMenu projects={projects} />
      <div className="overflow-auto m-1 border border-gray-200 rounded-lg h-full">
        <Calendar year={2026} events={events} />
      </div>
    </div>
  );
}
