import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export const HeaderSection = async () => {
  const user = await currentUser();
  console.log(user?.username);
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

        <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium sm:mt-0 mt-5">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-between gap-12 w-full">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-1">6</div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-1">3</div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-orange-400 mb-1">2</div>
          <div className="text-gray-400 text-sm">In Progress</div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400 mb-1">1</div>
          <div className="text-gray-400 text-sm">TBR</div>
        </div>
      </div>
    </section>
  );
};
