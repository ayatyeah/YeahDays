"use client";
import dynamic from "next/dynamic";
const loading = () => <p role="status" className="p-6">Opening your course…</p>;
const EventScreen = dynamic(() => import("./EventScreen"), { loading });
export default function EventRoute() {
  return <div className="g-event-workspace"><EventScreen /></div>;
}
