import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // check if user has a recorded Annual Planning Calendar id
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  let annualPlanningCalendarId = user?.annualPlanningCalendarId;

  if (annualPlanningCalendarId) {
    console.log("existing calendar");
    return Response.json({
      annualPlanningCalendarId,
      msg: "already existing calendar",
    });
  }

  // if user does not already have a calendarId, create the calendar
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
        summary: process.env.PLANNING_CALENDAR_NAME,
        timeZone: "Europe/Paris",
      }),
    },
  );

  if (!createRes.ok) {
    const err = await createRes.json();
    return new Response(JSON.stringify(err), { status: createRes.status });
  }

  const annualPlanningCalendar = await createRes.json();

  // save the calendarId in user
  await prisma.user.update({
    where: { email: session?.user?.email },
    data: { annualPlanningCalendarId: annualPlanningCalendar.id },
  });

  return Response.json({
    id: annualPlanningCalendar.id,
    summary: annualPlanningCalendar.summary,
    msg: "created calendar",
  });
}
