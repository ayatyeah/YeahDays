import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Ambient from "@/components/Ambient";
import BottomNav from "@/components/BottomNav";
import CreateTaskModal from "@/components/CreateTaskModal";
import WardrobeModal from "@/components/WardrobeModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "YeahDays",
  title: "YeahDays — расти с каждой задачей",
  description:
    "Минималистичный трекер задач, где твой персонаж эволюционирует с каждой выполненной задачей.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YeahDays",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
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
        <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-28 pt-6">
          {children}
        </div>
        <BottomNav />
        <CreateTaskModal />
        <WardrobeModal />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
