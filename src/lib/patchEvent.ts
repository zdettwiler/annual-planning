"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import simplifyGoogleEvent from "@/lib/simplifyGoogleEvent";

export default async function patchEvent(event) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
  });

  const planningCalendarId = user?.annualPlanningCalendarId ?? "primary"; // TODO: deal with fallback
  console.log(planningCalendarId);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(planningCalendarId)}/events/${event.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.project
          ? `${event.project}/${event.label}`
          : event.label,
        start: {
          date: event.isAllDay ? event.start : undefined,
          dateTime: event.isAllDay ? undefined : event.start,
        },
        end: {
          date: event.isAllDay ? event.end : undefined,
          dateTime: event.isAllDay ? undefined : event.end,
        },
      }),
    },
  );
  const updatedEvent = await res.json();
  console.log(updatedEvent);
  return simplifyGoogleEvent(updatedEvent);
}
