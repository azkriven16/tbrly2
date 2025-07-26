import { getTBREntries } from "@/actions/tbr-actions";
import { HeaderSection } from "@/components/dashboard/header-section";
import { TBRSection } from "@/components/dashboard/tbr-section";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function TBRHeader() {
  const { userId } = await auth();

  // If no user is authenticated, redirect to the home page
  if (!userId) redirect("/");

  // Server-side data fetching
  const entries = await getTBREntries(userId);
  console.log(entries, "tbr entries");
  return (
    <div>
      <HeaderSection />
      <TBRSection initialBooks={entries.data || []} />
    </div>
  );
}
