"use server";

import { db } from "@/db";
import { books } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { BookInput, BookWithUser } from "@/db/schema";

// CREATE - Add a new book
export const createBook = async (bookData: BookInput) => {
  try {
    const [newBook] = await db
      .insert(books)
      .values({
        title: bookData.title,
        category: bookData.category || "Book",
        status: bookData.status || "Want to Read",
        imageUrl: bookData.imageUrl,
        rating: bookData.rating,
        genres: bookData.genres || [],
        notes: bookData.notes,
        userId: bookData.userId,
      })
      .returning();

    revalidatePath("/books");
    return { success: true, data: newBook };
  } catch (error) {
    console.error("Error creating book:", error);
    return { success: false, error: "Failed to create book" };
  }
};

// READ - Get all books for a user using relational queries
export const getTBREntries = async (userId: string) => {
  try {
    const entries = await db.query.books.findMany({
      where: (books, { eq }) => eq(books.userId, userId),
      orderBy: (books, { desc }) => [desc(books.updatedAt)],
    });
    return { success: true, data: entries };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, error: "Failed to fetch books", data: [] };
  }
};

// READ - Get a single book by ID
export const getBookById = async (bookId: number, userId: string) => {
  try {
    const book = await db.query.books.findFirst({
      where: (books, { eq, and }) =>
        and(eq(books.id, bookId), eq(books.userId, userId)),
      with: {
        user: true,
      },
    });

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    return { success: true, data: book as BookWithUser };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: "Failed to fetch book" };
  }
};

// READ - Get books by status
export const getBooksByStatus = async (userId: string, status: string) => {
  try {
    const entries = await db.query.books.findMany({
      where: (books, { eq, and }) =>
        and(eq(books.userId, userId), eq(books.status, status)),
      orderBy: (books, { desc }) => [desc(books.updatedAt)],
    });
    return { success: true, data: entries };
  } catch (error) {
    console.error("Error fetching books by status:", error);
    return { success: false, error: "Failed to fetch books", data: [] };
  }
};

// READ - Get books by category
export const getBooksByCategory = async (userId: string, category: string) => {
  try {
    const entries = await db.query.books.findMany({
      where: (books, { eq, and }) =>
        and(eq(books.userId, userId), eq(books.category, category)),
      orderBy: (books, { desc }) => [desc(books.updatedAt)],
    });
    return { success: true, data: entries };
  } catch (error) {
    console.error("Error fetching books by category:", error);
    return { success: false, error: "Failed to fetch books", data: [] };
  }
};

// UPDATE - Update a book
export const updateBook = async (
  bookId: number,
  userId: string,
  updates: Partial<BookInput>
) => {
  try {
    const [updatedBook] = await db
      .update(books)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, bookId), eq(books.userId, userId)))
      .returning();

    if (!updatedBook) {
      return { success: false, error: "Book not found or unauthorized" };
    }

    revalidatePath("/books");
    return { success: true, data: updatedBook };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, error: "Failed to update book" };
  }
};

// UPDATE - Update book status
export const updateBookStatus = async (
  bookId: number,
  userId: string,
  status: string
) => {
  try {
    const [updatedBook] = await db
      .update(books)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, bookId), eq(books.userId, userId)))
      .returning();

    if (!updatedBook) {
      return { success: false, error: "Book not found or unauthorized" };
    }

    revalidatePath("/books");
    return { success: true, data: updatedBook };
  } catch (error) {
    console.error("Error updating book status:", error);
    return { success: false, error: "Failed to update book status" };
  }
};

// UPDATE - Update book rating
export const updateBookRating = async (
  bookId: number,
  userId: string,
  rating: number
) => {
  try {
    // Validate rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      return { success: false, error: "Rating must be between 0 and 5" };
    }

    const [updatedBook] = await db
      .update(books)
      .set({
        rating,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, bookId), eq(books.userId, userId)))
      .returning();

    if (!updatedBook) {
      return { success: false, error: "Book not found or unauthorized" };
    }

    revalidatePath("/books");
    return { success: true, data: updatedBook };
  } catch (error) {
    console.error("Error updating book rating:", error);
    return { success: false, error: "Failed to update book rating" };
  }
};

// DELETE - Delete a book
export const deleteBook = async (bookId: number, userId: string) => {
  try {
    const [deletedBook] = await db
      .delete(books)
      .where(and(eq(books.id, bookId), eq(books.userId, userId)))
      .returning();

    if (!deletedBook) {
      return { success: false, error: "Book not found or unauthorized" };
    }

    revalidatePath("/books");
    return { success: true, data: deletedBook };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete book" };
  }
};

// BULK OPERATIONS - Fixed to use inArray properly
export const bulkUpdateBookStatus = async (
  bookIds: number[],
  userId: string,
  status: string
) => {
  try {
    if (bookIds.length === 0) {
      return { success: true, data: [] };
    }

    const updatedBooks = await db
      .update(books)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(books.userId, userId),
          inArray(books.id, bookIds) // Fixed: use inArray for multiple IDs
        )
      )
      .returning();

    revalidatePath("/books");
    return { success: true, data: updatedBooks };
  } catch (error) {
    console.error("Error bulk updating book status:", error);
    return { success: false, error: "Failed to bulk update books" };
  }
};

// Bulk delete books - Fixed to use inArray properly
export const bulkDeleteBooks = async (bookIds: number[], userId: string) => {
  try {
    if (bookIds.length === 0) {
      return { success: true, data: [] };
    }

    const deletedBooks = await db
      .delete(books)
      .where(
        and(
          eq(books.userId, userId),
          inArray(books.id, bookIds) // Fixed: use inArray for multiple IDs
        )
      )
      .returning();

    revalidatePath("/books");
    return { success: true, data: deletedBooks };
  } catch (error) {
    console.error("Error bulk deleting books:", error);
    return { success: false, error: "Failed to bulk delete books" };
  }
};

// ANALYTICS/STATS
export const getUserReadingStats = async (userId: string) => {
  try {
    const allBooks = await db.query.books.findMany({
      where: (books, { eq }) => eq(books.userId, userId),
    });

    const stats = {
      total: allBooks.length,
      wantToRead: allBooks.filter((book) => book.status === "Want to Read")
        .length,
      currentlyReading: allBooks.filter(
        (book) => book.status === "Currently Reading"
      ).length,
      completed: allBooks.filter((book) => book.status === "Completed").length,
      dnf: allBooks.filter((book) => book.status === "DNF").length,
      onHold: allBooks.filter((book) => book.status === "On Hold").length,
      averageRating:
        allBooks
          .filter((book) => book.rating !== null)
          .reduce((sum, book) => sum + (book.rating || 0), 0) /
          allBooks.filter((book) => book.rating !== null).length || 0,
      ratedBooks: allBooks.filter((book) => book.rating !== null).length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return { success: false, error: "Failed to fetch reading stats" };
  }
};
