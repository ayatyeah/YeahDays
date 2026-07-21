import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Ambient from "@/components/Ambient";
import BottomNav from "@/components/BottomNav";
import CreateTaskModal from "@/components/CreateTaskModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "YeahDays",
  title: "YeahDays — одно действие в день",
  description:
    "Не список задач, а подборка действий под твоё состояние. Свайпни то, что берёшь на сегодня — и смотри, как растёт твой персонаж.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YeahDays",
  },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Ambient />
        <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-24 pt-6">
          {children}
        </div>
        <BottomNav />
        <CreateTaskModal />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
