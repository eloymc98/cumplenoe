import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import TeamTest from "@/components/TeamTest";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");
  if (participant!.testCompletedAt) redirect("/sobre");

  return <TeamTest />;
}
