import JoinGoal from "@/components/path/JoinGoal";

export const metadata = { title: "Учиться вместе — YeahGrind" };

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <JoinGoal code={code} />;
}
