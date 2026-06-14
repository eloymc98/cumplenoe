import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getMaterialState } from "@/lib/material";
import MaterialList from "@/components/MaterialList";

export const dynamic = "force-dynamic";

export default async function MaterialPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");

  const initial = await getMaterialState();
  return <MaterialList initial={initial} myId={participant.id} />;
}
