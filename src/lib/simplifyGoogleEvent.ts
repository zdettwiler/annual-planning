import moment from "moment";
import type { GoogleEvent, SimpleEvent } from "@/lib/types";

export default function simplifyGoogleEvent(
  googleEvent: GoogleEvent,
): SimpleEvent {
  const start = googleEvent.start.date || googleEvent.start.dateTime;
  const end = googleEvent.end.date || googleEvent.end.dateTime;

  return {
    id: googleEvent.id,
    label: googleEvent.summary.includes("/")
      ? googleEvent.summary.split("/")[1]
      : googleEvent.summary,
    project: googleEvent.summary.includes("/")
      ? googleEvent.summary.split("/")[0]
      : undefined,
    start,
    end,
    duration: moment.duration(moment(end).diff(moment(start))).toJSON(),
    isAllDay: !!googleEvent.start.date,
  };
}
