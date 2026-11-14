"use client";
import dynamic from "next/dynamic";
import { CLOUD_ENDTERM_ID } from "@/lib/events/cloudComputingEndterm/meta";
const loading = () => <p role="status" className="p-6">Opening your course…</p>;
const CloudEndterm = dynamic(() => import("@/components/events/CloudEndterm"), { loading });
const RmtEndterm = dynamic(() => import("@/components/events/RmtEndterm"), { loading });
const EventScreen = dynamic(() => import("./EventScreen"), { loading });
export default function EventRoute({ id }: { id: string }) {
  return <div className="g-event-workspace">{id === "research-methods-endterm" ? <RmtEndterm /> : id === CLOUD_ENDTERM_ID ? <CloudEndterm /> : <EventScreen />}</div>;
}
