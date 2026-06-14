import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getVoteState } from "@/lib/votes";
import Stories from "@/components/Stories";

export const dynamic = "force-dynamic";

export default async function JuegosPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");

  const initialVote = await getVoteState(participant.id);
  return <Stories initialVote={initialVote} />;
}
