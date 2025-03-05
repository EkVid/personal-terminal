'use client';
import dynamic from "next/dynamic";


const TerminalComponent = dynamic(() => import("./components/UnixTerminal"), {
    ssr: false
})

export default function Home() {
  return (
    <main className="h-screen w-full">
      <TerminalComponent />
    </main>
  );
}
