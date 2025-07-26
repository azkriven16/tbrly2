"use client";

import { useState, useTransition, useEffect } from "react";
import { Book, BOOK_CATEGORIES, BOOK_STATUSES } from "@/db/schema";
import { updateBook } from "@/actions/tbr-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface EditEntryModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditEntryModal = ({
  book,
  isOpen,
  onClose,
  onSuccess,
}: EditEntryModalProps) => {
  const { userId } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState({
    title: book?.title || "",
    category: book?.category || "Book",
    status: book?.status || "Want to Read",
    imageUrl: book?.imageUrl || "",
    rating: book?.rating?.toString() || "",
    notes: book?.notes || "",
  });

  const [genres, setGenres] = useState<string[]>(book?.genres || []);
  const [newGenre, setNewGenre] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        category: book.category,
        status: book.status,
        imageUrl: book.imageUrl || "",
        rating: book.rating?.toString() || "",
        notes: book.notes || "",
      });
      setGenres(book.genres || []);
      setErrors({});
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (
      formData.rating &&
      (isNaN(Number(formData.rating)) ||
        Number(formData.rating) < 0 ||
        Number(formData.rating) > 5)
    ) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !book || !userId) return;

    startTransition(async () => {
      try {
        const updateData = {
          title: formData.title.trim(),
          category: formData.category,
          status: formData.status,
          imageUrl: formData.imageUrl.trim() || null,
          rating: formData.rating ? Number(formData.rating) : null,
          genres: genres,
          notes: formData.notes.trim() || null,
          userId,
        };

        const result = await updateBook(book.id, userId, updateData);

        if (result.success) {
          onSuccess?.();
          onClose();
          toast("Book updated successfully");
        } else {
          // Handle error - you might want to show an error toast
          console.error("Failed to update book:", result.error);
        }
      } catch (error) {
        console.error("Error updating book:", error);
      }
    });
  };

  const handleAddGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setGenres(genres.filter((genre) => genre !== genreToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGenre();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {BOOK_CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {BOOK_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL (optional)
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-sm font-medium">
              Rating (optional)
            </Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="4.5"
            />
            {errors.rating && (
              <p className="text-red-400 text-sm">{errors.rating}</p>
            )}
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Genres</Label>
            <div className="flex gap-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800 border-gray-700 text-white flex-1"
                placeholder="Add genre..."
              />
              <Button
                type="button"
                onClick={handleAddGenre}
                className="bg-gray-700 hover:bg-gray-600 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            {/* Genre tags */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genre)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              placeholder="Add your thoughts, review, or notes about this book..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              {isPending ? "Updating..." : "Update Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
