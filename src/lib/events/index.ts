import type { StudyEvent } from "./types";
import { event as researchMethods } from "./researchMethods/event";
import { event as computerNetworks } from "./computerNetworks/event";
import { event as cloudComputing } from "./cloudComputing/event";
import { event as computerVision } from "./computerVision/event";
import { event as projectDefense } from "./projectDefense/event";

/**
 * Все ивенты раздела «Учёба» — для сервера и тестов. Новый ивент — папка с
 * содержимым и event.ts в ней, плюс строка здесь и в client.ts.
 *
 * В браузер этот список целиком не попадает: экраны ивентов грузят только
 * нужный ивент отдельным чанком (lib/events/client.ts), а списки получают
 * лёгкие сводки с сервера — иначе каждая страница тянула бы ~6 МБ контента.
 */
export const EVENTS: StudyEvent[] = [researchMethods, computerNetworks, cloudComputing, computerVision, projectDefense];

export function findEvent(id: string): StudyEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
