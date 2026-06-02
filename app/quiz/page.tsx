import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/session";
import { getBest } from "@/lib/quiz";
import Quiz from "@/components/Quiz";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/");

  const best = await getBest(participant!.id);
  return <Quiz best={best?.points ?? 0} />;
}
