import Image from "next/image";
import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-zinc-50 font-sans dark:bg-black p-5">
      {/* <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        To get started, edit the page.tsx file.
      </h1> */}
      <div className="overflow-auto m-1 border border-gray-200 rounded-lg h-full">
        <Calendar year={2026} />
      </div>
    </div>
  );
}
