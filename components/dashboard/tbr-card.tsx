"use client";

import { useState, useTransition } from "react";
import { Book } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { EditEntryModal } from "./edit-tbr-modal";
// Import your server actions when ready
// import { deleteBook, updateBookStatus } from "@/actions/tbr-actions";

interface TBRCardProps {
  book: Book;
  onUpdate?: () => void; // Callback to refresh data after updates
}

export const TBRCard = ({ book, onUpdate }: TBRCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Client-side handler functions
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    // Called when edit is successful
    onUpdate?.(); // Refresh parent data if needed
  };

  const handleDelete = async (bookId: number) => {
    // Add confirmation dialog
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    startTransition(async () => {
      try {
        // Uncomment when you have the server action ready
        // const result = await deleteBook(bookId, userId);
        // if (result.success) {
        //   onUpdate?.(); // Refresh data
        //   console.log("Book deleted successfully");
        // } else {
        //   console.error("Failed to delete book:", result.error);
        // }
        console.log("Delete book:", bookId);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    });
  };

  const handleStatusChange = async (bookId: number, newStatus: string) => {
    startTransition(async () => {
      try {
        // Uncomment when you have the server action ready
        // const result = await updateBookStatus(bookId, userId, newStatus);
        // if (result.success) {
        //   onUpdate?.(); // Refresh data
        //   console.log("Status updated successfully");
        // } else {
        //   console.error("Failed to update status:", result.error);
        // }
        console.log("Change status:", bookId, newStatus);
      } catch (error) {
        console.error("Error updating status:", error);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Want to Read":
        return "bg-blue-600 text-blue-100";
      case "Currently Reading":
        return "bg-green-600 text-green-100";
      case "Completed":
        return "bg-green-700 text-green-100";
      case "DNF":
        return "bg-red-600 text-red-100";
      case "On Hold":
        return "bg-yellow-600 text-yellow-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Book":
        return "bg-purple-600 text-purple-100";
      case "Audiobook":
        return "bg-blue-600 text-blue-100";
      case "Ebook":
        return "bg-green-600 text-green-100";
      case "Graphic Novel":
        return "bg-orange-600 text-orange-100";
      case "Manga":
        return "bg-pink-600 text-pink-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };

  return (
    <>
      <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              {book.imageUrl ? (
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  width={80}
                  height={120}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-20 h-30 bg-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center p-2">
                    No Cover
                  </span>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white truncate pr-2">
                  {book.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit()}
                    disabled={isPending}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Status and Category Badges */}
              <div className="flex gap-2 mb-3">
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
                <Badge className={getCategoryColor(book.category)}>
                  {book.category}
                </Badge>
              </div>

              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-yellow-500 font-medium">
                    {book.rating}
                  </span>
                </div>
              )}

              {/* Genres */}
              {book.genres && book.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {book.genres.slice(0, 3).map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                  {book.genres.length > 3 && (
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      +{book.genres.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Notes Preview */}
              {book.notes && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                  {book.notes}
                </p>
              )}

              {/* Quick Actions */}
              {book.status === "Want to Read" && (
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStatusChange(book.id, "Currently Reading")
                    }
                    disabled={isPending}
                    className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {isPending ? "Updating..." : "Start Reading"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditEntryModal
        book={book}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
