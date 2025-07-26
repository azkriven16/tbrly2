"use client";

import { useState } from "react";
import { Book } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { TBRCard } from "@/components/dashboard/tbr-card";
import { TBRFilters } from "@/components/dashboard/tbr-filters";

interface TBRSectionProps {
  initialBooks: Book[];
}

export const TBRSection = ({ initialBooks }: TBRSectionProps) => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);

  const handleRefresh = () => {
    // This would typically refetch data from the server
    // For now, we'll just keep the current state
    // You can implement a refresh mechanism here if needed
    console.log("Refreshing data...");
  };

  if (!initialBooks || initialBooks.length === 0) {
    return (
      <section className="">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No books in your TBR list yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start building your reading list by adding some books!
          </p>
          <Button
            variant="outline"
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Add Your First Book
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      {/* Filters */}
      <TBRFilters
        books={initialBooks}
        onFilteredBooksChange={setFilteredBooks}
      />

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No books match your filters
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredBooks.map((entry) => (
            <TBRCard key={entry.id} book={entry} onUpdate={handleRefresh} />
          ))}
        </div>
      )}
    </section>
  );
};
