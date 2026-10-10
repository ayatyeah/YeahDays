import { EVENTS } from "@/lib/events";
import EventScreen from "./EventScreen";

/**
 * Страница ивента — статическая: оболочка собирается при сборке для каждого
 * ивента и отдаётся мгновенно (и из кэша service worker'а), а содержимое
 * нужного ивента подгружает сам экран отдельным чанком (lib/events/client).
 */
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export default function EventPage() {
  return <EventScreen />;
}
