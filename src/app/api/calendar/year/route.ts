import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // check if user has a recorded Annual Planning Calendar id

  // if not, get it
  const annualPlanningCalendarName = process.env.PLANNING_CALENDAR_NAME;

  // List all calendars
  const listRes = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  if (!listRes.ok) {
    const err = await listRes.json();
    return new Response(JSON.stringify(err), { status: listRes.status });
  }

  // Search for Annual Planning Calendar
  const calendars = await listRes.json();
  let annualPlanningCalendar = calendars.items.find(
    (c: any) => c.summary === annualPlanningCalendarName,
  );

  // Create it if it does not exist
  if (!annualPlanningCalendar) {
    console.log("create missing calendar");
    const createRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: annualPlanningCalendarName,
          timeZone: "Europe/Paris",
        }),
      },
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      return new Response(JSON.stringify(err), { status: createRes.status });
    }

    annualPlanningCalendar = await createRes.json();
  }

  return Response.json({
    id: annualPlanningCalendar.id,
    summary: annualPlanningCalendar.summary,
  });
}
