import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";

export const metadata: Metadata = {
  title: "YeahGrind — одно действие в день",
  description:
    "Не список задач, а ежедневная колода действий под твоё состояние. Свайпнул — сделал — день засчитан.",
  openGraph: {
    title: "YeahGrind — одно действие в день",
    description:
      "Не список задач, а ежедневная колода действий под твоё состояние.",
    type: "website",
    url: "https://yeahgrind.site",
    siteName: "YeahGrind",
    locale: "ru_RU",
    // openGraph страницы заменяет общий из layout целиком, поэтому картинку
    // превью нужно назвать и здесь — иначе у главной её не будет.
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "YeahGrind — одно действие в день",
      },
    ],
  },
};

export default function Page() {
  return <Landing />;
}
