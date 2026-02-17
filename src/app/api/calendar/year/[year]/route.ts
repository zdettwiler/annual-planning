import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getYearEvents from "@/lib/getYearEvents";

export async function GET(
  req: Request,
  { params }: { params: { year: string } },
) {
  const { year } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await getYearEvents(
    session,
    year ?? new Date().getFullYear().toString(),
  );
  return Response.json(data);
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
