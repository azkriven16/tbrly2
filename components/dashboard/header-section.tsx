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
    <section className="py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8 border-b pb-2">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {user?.username
              ? `${user.username}'s TBR List`
              : user?.firstName
              ? `${user.firstName}'s TBR List`
              : "Your TBR List"}
          </h1>
          <p className="text-gray-400 text-lg">
            Track your books, anime, and manga to read or watch
          </p>
        </div>

        <CreateTBRButton />
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-between gap-12 w-full">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-1">
            {stats?.total || 0}
          </div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-1">
            {stats?.completed || 0}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-orange-400 mb-1">
            {stats?.currentlyReading || 0}
          </div>
          <div className="text-gray-400 text-sm">Reading</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400 mb-1">
            {stats?.wantToRead || 0}
          </div>
          <div className="text-gray-400 text-sm">TBR</div>
        </div>

        {stats && (stats.dnf > 0 || stats.onHold > 0) && (
          <div className="text-center">
            <div className="text-4xl font-bold text-red-400 mb-1">
              {(stats.dnf || 0) + (stats.onHold || 0)}
            </div>
            <div className="text-gray-400 text-sm">DNF/Hold</div>
          </div>
        )}
      </div>

      {/* Error handling for stats */}
      {!statsResult.success && (
        <div className="text-center text-gray-500 text-sm mt-4">
          Unable to load reading statistics
        </div>
      )}
    </section>
  );
};
