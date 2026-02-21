import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";
import moment from "moment";

export default async function getYearEvents(
  session: Session,
  year: string | number,
) {
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  const planningCalendarId = user?.annualPlanningCalendarId ?? "primary"; // TODO: deal with fallback

  // Calculate date range
  const startYear = new Date(parseInt(year), 0, 1).toISOString();
  const endYear = new Date(parseInt(year), 11, 31).toISOString();

  // Fetch events from Google Calendar
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(planningCalendarId)}/events?timeMin=${startYear}&timeMax=${endYear}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await res.json();

  // return Response.json(data);
  return data.items.map((d) => {
    const start = d.start.date || d.start.dateTime;
    const end = d.end.date || d.end.dateTime;

    return {
      id: d.id,
      label: d.summary.includes("/") ? d.summary.split("/")[1] : d.summary,
      project: d.summary.includes("/") ? d.summary.split("/")[0] : undefined,
      start,
      end,
      duration: moment.duration(moment(end).diff(moment(start))).toJSON(),
      isAllDay: d.start.date,
    };
  });
}
