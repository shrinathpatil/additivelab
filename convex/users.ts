import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type RoleType = "admin" | "user";

export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = {
      clerkId: args.clerkId,
      username: args.username,
      email: args.email,
      role: "user" as RoleType,
    };
    const userId = await ctx.db.insert("users", user);

    if (userId) {
      console.log("User created successfully!");
    }

    const cartId = await ctx.db.insert("carts", {
      userId,
      items: [],
    });

    await ctx.db.patch(userId, { cartId });

    return userId;
  },
});

export const getUserClient = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as Id<"users">);
    if (!user) {
      console.log("User Not Found!");
      return null;
    }
    return user;
  },
});

export const getUserServer = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as Id<"users">);
    if (!user) {
      console.log("User Not Found!");
      return null;
    }
    return user;
  },
});
