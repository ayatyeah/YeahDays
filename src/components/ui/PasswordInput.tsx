"use client";

import { useState } from "react";
import { YgIcon } from "@/components/yg-icons";
import { cn } from "@/lib/cn";

/**
 * Поле пароля с глазком.
 *
 * Пароль на телефоне набирают вслепую по точкам, и опечатку видно только
 * по отказу входа — а после нескольких отказов человек уходит «восстанавливать»
 * пароль, который на самом деле помнит. Глазок стоит внутри поля справа,
 * у самого большого пальца, и переключает `type` — ровно как в системных
 * формах iOS.
 *
 * Сам `input` остаётся обычным: компонент пробрасывает любые его свойства,
 * поэтому поле работает и управляемым (value/onChange), и неуправляемым
 * (name/defaultValue) — на входе и регистрации как раз второй случай.
 */
export default function PasswordInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [shown, setShown] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={shown ? "text" : "password"}
        // место под кнопку: без него точки пароля подлезали под глаз
        className={cn(className, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? "Скрыть пароль" : "Показать пароль"}
        aria-pressed={shown}
        // tabIndex={-1}: при переходе по Tab от пароля ждут кнопку «Войти»,
        // а не глазок
        tabIndex={-1}
        className="press absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:text-[var(--color-fg-dim)]"
      >
        <YgIcon name={shown ? "eye-off" : "eye"} className="h-5 w-5" />
      </button>
    </div>
  );
}
