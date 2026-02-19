import DayCell from "@/components/DayCell";
import Event from "@/components/Event";

interface MonthRowProps {
  year: number;
  month: number;
  events: Array<{
    id: string;
    label: string;
    project: string;
    start: string;
    end: string;
  }>;
}

const projectColours = [
  "bg-blue-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-purple-500",
];

export default function MonthRow({ year, month, events }: MonthRowProps) {
  const shortMonthName = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
  }).format(new Date(year, month, 1));

  const projects = events.reduce((projects, event) => {
    if (!projects.includes(event.project)) {
      projects.push(event.project);
    }
    return projects;
  }, []);
  console.log(projects);

  console.log(projectColours[projects.indexOf("Vacances")]);

  return (
    <div className="relative grid grid-cols-[30px_1fr] h-16">
      {/* Month label */}
      <div className="flex items-center justify-center font-medium">
        <span className="transform -rotate-90 whitespace-nowrap">
          {shortMonthName}
        </span>
      </div>

      {/* Day grid */}
      <div className="relative grid grid-cols-[repeat(31,minmax(0,1fr))]">
        {[...Array(31)].map((_, i) => (
          <DayCell key={i} date={new Date(year, month, i + 1)} month={month} />
        ))}
      </div>

      {/* Event layer */}
      <div className="absolute left-[30px] right-0 top-0 h-full grid grid-cols-[repeat(31,minmax(0,1fr))] auto-rows-[1rem] pt-5">
        {events
          .filter((e) => new Date(e.start).getMonth() === month)
          .map((e, i) => (
            <Event
              key={i}
              colour={projectColours[projects.indexOf(e.project)]}
              event={e}
            />
          ))}
      </div>
    </div>
  );
}
