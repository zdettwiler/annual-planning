export interface GoogleEvent {
  id: string;
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

export interface SimpleEvent {
  id: string;
  label: string;
  project: string | undefined;
  start: string; // TODO Date?
  end: string; // TODO Date?
  duration: string;
  isAllDay: boolean;
}
