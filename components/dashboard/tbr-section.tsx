import { getTBREntries } from "@/actions/tbr-actions";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const TBRSection = async () => {
  const { userId } = await auth();
  // If no user is authenticated, redirect to the home page
  if (!userId) redirect("/");
  console.log(userId);

  const entries = await getTBREntries(userId);
  console.log(entries, "tbr entries");
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 border rounded-md">
      No entries yet. Add your first book, anime, or manga!{" "}
      <Button className="mt-5">Add Your First Entry</Button>
    </div>
  );
};
