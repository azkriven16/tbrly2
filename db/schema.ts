import { relations } from "drizzle-orm";
import {
  bigint,
  integer,
  json,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  clerkId: text("clerkId").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  photo: text("photo").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const books = pgTable("books", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Book"), // Book, Audiobook, Ebook, Graphic Novel, Manga
  status: text("status").notNull().default("Want to Read"), // Want to Read, Currently Reading, Completed, DNF, On Hold
  imageUrl: text("image_url"),
  rating: real("rating"), // 0-5 stars, allows decimals like 4.5
  genres: json("genres").$type<string[]>().default([]), // Array of genre strings
  notes: text("notes"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const booksRelations = relations(books, ({ one }) => ({
  user: one(users, { fields: [books.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  books: many(books),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserInput = Omit<NewUser, "id" | "createdAt" | "updatedAt">;

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

export type BookInput = Omit<NewBook, "id" | "createdAt" | "updatedAt">;

// Optional: Export types with relations
export type UserWithBooks = User & {
  books: Book[];
};

export type BookWithUser = Book & {
  user: User;
};

// Type guards and enums for better type safety
export const BOOK_CATEGORIES = [
  "Book",
  "Audiobook",
  "Ebook",
  "Graphic Novel",
  "Manga",
] as const;

export const BOOK_STATUSES = [
  "Want to Read",
  "Currently Reading",
  "Completed",
  "DNF",
  "On Hold",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
export type BookStatus = (typeof BOOK_STATUSES)[number];
