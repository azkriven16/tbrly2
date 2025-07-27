import { getUserReadingStats } from "@/actions/tbr-actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateTBRButton } from "@/components/dashboard/create-tbr-button";

export const HeaderSection = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  // If no user is authenticated, redirect to the home page
  if (!userId) redirect("/");

  // Fetch real reading stats
  const statsResult = await getUserReadingStats(userId);
  const stats = statsResult.success ? statsResult.data : null;

  console.log(user?.username);
  console.log("Reading stats:", stats);

  return (
    <section className="py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between border-b pb-4 sm:pb-2">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            {user?.username
              ? `${user.username}'s TBR List`
              : user?.firstName
              ? `${user.firstName}'s TBR List`
              : "Your TBR List"}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Track your books, anime, and manga to read or watch
          </p>
        </div>
        <CreateTBRButton />
      </div>
    </section>
  );
};
