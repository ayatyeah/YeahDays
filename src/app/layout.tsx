import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import CreateTaskModal from "@/components/CreateTaskModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthProvider from "@/components/AuthProvider";
import ThemeApplier from "@/components/ThemeApplier";

/**
 * Ставим data-theme ДО гидрации React — иначе у вернувшегося пользователя
 * со светлой темой на долю секунды мелькнёт тёмная (дефолт стора), пока
 * зустанд не восстановит значение из localStorage. Ключ и форма записи
 * должны совпадать с persist-конфигом useThemeStore.
 */
const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('yeahdays-theme');if(!raw)return;var theme=JSON.parse(raw).state.theme;if(theme==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "YeahGrind",
  title: "YeahGrind — одно действие в день",
  description:
    "Не список задач, а подборка действий под твоё состояние. Свайпни то, что берёшь на сегодня — и смотри, как растёт твой персонаж.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YeahGrind",
    // Заставки при запуске с домашнего экрана: без них iOS показывает
    // белый лист до первого кадра. Картинка подбирается по точным
    // размерам экрана — iPhone SE … 16 Pro Max, портрет.
    startupImage: [
      {
        url: "/splash/1320x2868.png",
        media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1290x2796.png",
        media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1284x2778.png",
        media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1242x2688.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1206x2622.png",
        media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1179x2556.png",
        media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1170x2532.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/1125x2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/828x1792.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/750x1334.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  // На iOS автоопределение превращает числа в телефонные ссылки — в
  // приложении про XP и стрики это выглядит как баг.
  formatDetection: { telephone: false, date: false, address: false },
  other: {
    // современный аналог apple-mobile-web-app-capable; Android и десктоп
    // ориентируются именно на него
    "mobile-web-app-capable": "yes",
  },
  // Суффикс -v3 в именах иконок: iOS и Safari кэшируют файл по адресу и
  // после смены картинки продолжали показывать старую даже у заново
  // добавленного ярлыка. Новое имя — единственный надёжный сброс.
  icons: {
    icon: [
      { url: "/favicon-v3.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192-v3.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512-v3.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon-v3.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // под вырез и домашнюю полосу: контент рисуется во весь экран, отступы
  // добавляем сами через env(safe-area-inset-*)
  viewportFit: "cover",
  // клавиатура сжимает контент, а не наезжает на него: поля ввода в
  // модалках перестают прятаться под ней
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // suppressHydrationWarning — data-theme ставится инлайн-скриптом ДО
  // гидрации (см. THEME_INIT_SCRIPT), поэтому серверный HTML и первый
  // клиентский рендер этого атрибута расходятся намеренно; это ожидаемо
  // и не патчится React, но без флага заливает консоль лишним варнингом.
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeApplier />
        <AuthProvider>
          <ErrorBoundary>
            <Shell>{children}</Shell>
          </ErrorBoundary>
          <CreateTaskModal />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
