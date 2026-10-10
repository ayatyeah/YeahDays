import { dateKey } from "./domain";
import type { PlannedTask, Todo } from "@/store/useUserStore";

/** Calendar week, with zero-valued future days. Repeats count once per day. */
export function weeklyActivity(
  plan: Pick<PlannedTask, "completed" | "date" | "completedAt">[],
  todos: Pick<Todo, "repeat" | "doneDays" | "done" | "date" | "completedAt">[],
  now = new Date(),
) {
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date, key: dateKey(date), count: 0 };
  });
  const add = (key: string) => {
    const day = days.find((d) => d.key === key);
    if (day && key <= dateKey(now)) day.count++;
  };
  plan.forEach((task) => {
    if (task.completed)
      add(task.completedAt ? dateKey(new Date(task.completedAt)) : task.date);
  });
  todos.forEach((todo) => {
    if (todo.repeat) new Set(todo.doneDays).forEach(add);
    else if (todo.done)
      add(todo.completedAt ? dateKey(new Date(todo.completedAt)) : todo.date);
  });
  return days;
}
