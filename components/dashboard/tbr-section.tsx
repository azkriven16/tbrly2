"use client";

import { useState, useOptimistic, useCallback, useMemo, useRef } from "react";
import type { Book } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { TBRCard } from "@/components/dashboard/tbr-card";
import { TBRFilters } from "@/components/dashboard/tbr-filters";

interface TBRSectionProps {
  initialBooks: Book[];
  onRefresh?: () => void;
}

export const TBRSection = ({ initialBooks, onRefresh }: TBRSectionProps) => {
  // Optimistic state for book operations (deletions, status changes, etc.)
  const [optimisticBooks, updateOptimisticBooks] = useOptimistic(
    initialBooks,
    (
      currentBooks,
      action: {
        type: "delete" | "restore" | "update";
        bookId: number;
        data?: Partial<Book>;
      }
    ) => {
      switch (action.type) {
        case "delete":
          return currentBooks.filter((book) => book.id !== action.bookId);
        case "restore":
          // Restore book - find it in initialBooks and add it back
          const bookToRestore = initialBooks.find(
            (book) => book.id === action.bookId
          );
          if (
            bookToRestore &&
            !currentBooks.find((book) => book.id === action.bookId)
          ) {
            return [...currentBooks, bookToRestore].sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
          }
          return currentBooks;
        case "update":
          return currentBooks.map((book) =>
            book.id === action.bookId ? { ...book, ...action.data } : book
          );
        default:
          return currentBooks;
      }
    }
  );

  // Use a ref to track the current filtered books to prevent loops
  const filteredBooksRef = useRef<Book[]>(optimisticBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(optimisticBooks);

  // Memoize the optimistic update handlers to prevent unnecessary re-renders
  const handleOptimisticDelete = useCallback((bookId: number) => {
    updateOptimisticBooks({ type: "delete", bookId });
  }, []);

  const handleDeleteError = useCallback((bookId: number) => {
    updateOptimisticBooks({ type: "restore", bookId });
  }, []);

  const handleOptimisticUpdate = useCallback(
    (bookId: number, data: Partial<Book>) => {
      updateOptimisticBooks({ type: "update", bookId, data });
    },
    []
  );

  const handleRefresh = useCallback(() => {
    console.log("Refreshing data...");
    onRefresh?.();
  }, [onRefresh]);

  // Improved filtered books change handler with better loop prevention
  const handleFilteredBooksChange = useCallback((filtered: Book[]) => {
    // Create a simple comparison key to detect actual changes
    const newKey = filtered
      .map((book) => `${book.id}-${book.status}-${book.updatedAt}`)
      .join(",");
    const currentKey = filteredBooksRef.current
      .map((book) => `${book.id}-${book.status}-${book.updatedAt}`)
      .join(",");

    // Only update if the books actually changed
    if (newKey !== currentKey) {
      filteredBooksRef.current = filtered;
      setFilteredBooks(filtered);
    }
  }, []);

  // Memoize the optimistic books to prevent unnecessary re-renders of TBRFilters
  const memoizedOptimisticBooks = useMemo(
    () => optimisticBooks,
    [optimisticBooks]
  );

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
        books={memoizedOptimisticBooks}
        onFilteredBooksChange={handleFilteredBooksChange}
      />

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            {optimisticBooks.length === 0
              ? "All books have been removed"
              : "No books match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {optimisticBooks.length === 0
              ? "Your recent actions have cleared your library."
              : "Try adjusting your search criteria or clear the filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredBooks.map((entry) => (
            <TBRCard
              key={entry.id}
              book={entry}
              onUpdate={handleRefresh}
              onOptimisticDelete={handleOptimisticDelete}
              onDeleteError={handleDeleteError}
              onOptimisticUpdate={handleOptimisticUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
};
