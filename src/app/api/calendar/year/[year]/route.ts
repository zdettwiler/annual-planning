import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { year: string } },
) {
  const { year } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const planningCalendarId = user?.annualPlanningCalendarId ?? "primary"; // TODO: deal with fallback

  // Calculate date range
  const startYear = new Date(parseInt(year), 0, 1).toISOString();
  const endYear = new Date(parseInt(year), 11, 1).toISOString();

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
  return Response.json(
    data.items.map((d) => ({
      id: d.id,
      label: d.summary,
      start: d.start.date || d.start.dateTime,
      end: d.end.date || d.end.dateTime,
    })),
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();
  return Response.json(data);
}
