import { CATEGORIES, type CategoryKey } from "./domain";
import { emptyHistory, type HistorySignals } from "./recommendation";

/** Событие в том виде, как лежит в БД (нужные поля). */
export interface StoredEvent {
  actionId: string;
  type: "accept" | "reject" | "complete" | "skip";
  category: string | null;
  xp: number | null;
  at: Date | number;
}

/**
 * Собирает историю пользователя (сигналы для движка) из событий в БД.
 * Это делает рекомендации серверно-авторитетными: подбор одинаков на
 * любом устройстве и переживает очистку кэша браузера.
 */
export function historyFromEvents(events: StoredEvent[]): HistorySignals {
  const h = emptyHistory();

  const bumpCat = (cat: CategoryKey, field: "taken" | "done") => {
    const cc = h.categoryCompletion[cat] ?? { taken: 0, done: 0 };
    cc[field] += 1;
    h.categoryCompletion[cat] = cc;
  };

  for (const e of events) {
    const at = typeof e.at === "number" ? e.at : new Date(e.at).getTime();
    h.lastSeen[e.actionId] = Math.max(h.lastSeen[e.actionId] ?? 0, at);
    const cat = (e.category ?? null) as CategoryKey | null;

    switch (e.type) {
      case "accept":
        h.accepted[e.actionId] = (h.accepted[e.actionId] ?? 0) + 1;
        if (cat && CATEGORIES[cat]) bumpCat(cat, "taken");
        break;
      case "reject":
        h.rejected[e.actionId] = (h.rejected[e.actionId] ?? 0) + 1;
        break;
      case "complete":
        h.completed[e.actionId] = (h.completed[e.actionId] ?? 0) + 1;
        if (cat && CATEGORIES[cat]) {
          bumpCat(cat, "done");
          if (e.xp) h.statXp[CATEGORIES[cat].stat] += e.xp;
        }
        break;
    }
  }

  return h;
}
