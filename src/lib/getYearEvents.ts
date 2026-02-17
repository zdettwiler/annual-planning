import { prisma } from "@/lib/prisma";

export default async function getYearEvents(session, year) {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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
  console.log(data);

  // return Response.json(data);
  return data.items.map((d) => ({
    id: d.id,
    label: d.summary,
    start: d.start.date || d.start.dateTime,
    end: d.end.date || d.end.dateTime,
  }));
}
