import UnitPage from "@/components/path/UnitPage";

export const metadata = { title: "Юнит — YeahGrind" };

export default async function Page({ params }: { params: Promise<{ id: string; unitId: string }> }) {
  const { id, unitId } = await params;
  return <UnitPage goalId={id} unitId={unitId} />;
}
