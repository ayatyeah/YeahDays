"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Ловит рантайм-ошибки рендера и показывает дружелюбный экран вместо
 * белой страницы. Даёт две кнопки: перезагрузить (обычно чинит) и
 * сбросить данные — на случай испорченного localStorage.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // В проде здесь была бы отправка в Sentry/аналитику.
    console.error("YeahDays crash:", error);
  }

  private reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  private reset = () => {
    try {
      window.localStorage.removeItem("yeahdays-store");
    } catch {
      /* ignore */
    }
    this.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface)] text-3xl">
          🌫️
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">
          Что-то сломалось
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-snug text-[var(--color-fg-dim)]">
          Приложение споткнулось. Обычно помогает перезагрузка — твой прогресс
          сохранён.
        </p>
        <div className="mt-6 flex w-full max-w-[280px] flex-col gap-2.5">
          <button
            onClick={this.reload}
            className="h-12 rounded-2xl bg-[var(--color-fg)] text-[14px] font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          >
            Перезагрузить
          </button>
          <button
            onClick={this.reset}
            className="h-11 rounded-2xl text-[13px] font-medium text-[var(--color-muted)] transition hover:text-[var(--color-strength)]"
          >
            Сбросить данные и начать заново
          </button>
        </div>
      </div>
    );
  }
}
