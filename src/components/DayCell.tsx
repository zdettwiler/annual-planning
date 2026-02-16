interface DayCellProps {
  date: Date;
}

export default function DayCell({ date }: DayCellProps) {
  return (
    <div className="p-1 flex-1 border-l border-gray-200 text-xs">
      {date.getDate()}
    </div>
  );
}
