import { EVENTS } from "@/lib/events";
import EventRoute from "./EventRoute";
import { CLOUD_ENDTERM_ID } from "@/lib/events/cloudComputingEndterm/meta";

/**
 * Страница ивента — статическая: оболочка собирается при сборке для каждого
 * ивента и отдаётся мгновенно (и из кэша service worker'а), а содержимое
 * нужного ивента подгружает сам экран отдельным чанком (lib/events/client).
 */
export function generateStaticParams() {
  return [...EVENTS.map((e) => ({ id: e.id })), { id: CLOUD_ENDTERM_ID }];
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventRoute id={id} />;
}
