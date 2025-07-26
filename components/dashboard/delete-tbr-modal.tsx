"use client";

import { useTransition } from "react";
import type { Book } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { deleteBook } from "@/actions/tbr-actions";
import { toast } from "sonner";

interface DeleteTBRModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onOptimisticDelete?: (bookId: number) => void;
  onDeleteError?: (bookId: number) => void;
}

export const DeleteTBRModal = ({
  book,
  isOpen,
  onClose,
  onOptimisticDelete,
  onDeleteError,
}: DeleteTBRModalProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // Close modal immediately
    onClose();

    startTransition(async () => {
      try {
        // Optimistically remove the book from UI first
        onOptimisticDelete?.(book.id);

        // Show optimistic success toast with undo option
        const toastId = toast.success(`"${book.title}" deleted successfully`, {
          description: "The book has been removed from your library",
          duration: 5000,
          action: {
            label: "Undo",
            onClick: () => {
              // Revert the optimistic update
              onDeleteError?.(book.id);
              toast.dismiss(toastId);
              toast.info("Delete cancelled", {
                description: "The book has been restored to your library",
              });
            },
          },
        });

        // Perform the actual server action
        const result = await deleteBook(book.id, book.userId);

        if (!result.success) {
          // Revert optimistic update on failure
          onDeleteError?.(book.id);
          toast.dismiss(toastId);
          toast.error("Failed to delete book", {
            description:
              result.error || "Something went wrong. Please try again.",
          });
        }
        // If successful, the optimistic update stays and the success toast remains
      } catch (error) {
        // Revert optimistic update on error
        onDeleteError?.(book.id);
        toast.error("Failed to delete book", {
          description:
            "Network error. Please check your connection and try again.",
        });
        console.error("Error deleting book:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Delete Book
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">"{book.title}"</span>?
          </p>

          {book.notes && (
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">
                Your notes will also be deleted:
              </p>
              <p className="text-sm text-gray-300 line-clamp-3">{book.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Deleting..." : "Delete Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
