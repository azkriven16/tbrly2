"use server";

import { db } from "@/db";
import { UserInput, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  const data = await db.select().from(users);
  return data;
};

export const getUser = async (userId: any) => {
  const user = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.clerkId, userId),
    with: {
      books: true,
    },
  });

  return user;
};

export const addUser = async (user: UserInput) => {
  await db
    .insert(users)
    .values({
      clerkId: user.clerkId,
      email: user.email,
      name: user.name!,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
    })
    .returning({ clerkClientId: users.clerkId });
};

export const updateUser = async (
  clerkId: string,
  updatedData: Partial<UserInput>
) => {
  const result = await db
    .update(users)
    .set({
      ...updatedData,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, clerkId))
    .returning();

  return result[0];
};

export const deleteUser = async (clerkId: string) => {
  // Note: This will also delete all related books due to foreign key constraints
  // Make sure your database is set up with CASCADE delete if you want this behavior
  const result = await db
    .delete(users)
    .where(eq(users.clerkId, clerkId))
    .returning();

  return result[0];
};

// Alternative: Delete user by database ID instead of clerkId
export const deleteUserById = async (userId: number) => {
  const result = await db.delete(users).where(eq(users.id, userId)).returning();

  return result[0];
};

// Update user by database ID
export const updateUserById = async (
  userId: number,
  updatedData: Partial<UserInput>
) => {
  const result = await db
    .update(users)
    .set({
      ...updatedData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return result[0];
};
