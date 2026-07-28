import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Ambient from "@/components/Ambient";
import Shell from "@/components/Shell";
import CreateTaskModal from "@/components/CreateTaskModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthProvider from "@/components/AuthProvider";

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
  },
  // На iOS автоопределение превращает числа в телефонные ссылки — в
  // приложении про XP и стрики это выглядит как баг.
  formatDetection: { telephone: false, date: false, address: false },
  other: {
    // современный аналог apple-mobile-web-app-capable; Android и десктоп
    // ориентируются именно на него
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
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
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <AuthProvider>
          <Ambient />
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
