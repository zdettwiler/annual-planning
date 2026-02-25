"use client";

import Calendar from "@/components/Calendar";
import ProjectsMenu from "@/components/ProjectsMenu";
import type { GoogleEvent, SimpleEvent } from "@/lib/types";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function CalendarView({
  year,
  initEvents,
}: {
  year: number;
  initEvents: SimpleEvent[];
}) {
  const {
    data: events = initEvents,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/calendar/year/${year}`, fetcher); // TODO turn into a reusable useEvents

  // if (isLoading) return "Loading...";
  const projects = events.reduce((projects, event) => {
    if (!projects.includes(event.project)) {
      projects.push(event.project);
    }
    return projects;
  }, []);

  return (
    <>
      <ProjectsMenu projects={projects} />
      <div className="overflow-auto m-1 border border-gray-200 rounded-lg h-full">
        <Calendar year={2026} events={events} mutate={mutate} />
      </div>
    </>
  );
}
