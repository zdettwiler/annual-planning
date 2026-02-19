"use client";

import { useDraggable } from "@dnd-kit/react";

interface EventProps {
  colour: string;
  event: Object;
}

export default function Event({ colour, event }: EventProps) {
  const { ref } = useDraggable({
    id: event.id,
  });

  return (
    <div
      ref={ref}
      className={`text-xs/3 text-white ${colour} rounded-full h-3 self-center px-2`}
      style={{
        gridColumn: `${new Date(event.start).getDate()} / ${new Date(event.end).getDate()}`,
        gridRow: 1,
      }}
    >
      <span className="">{event.label}</span>
    </div>
  );
}
