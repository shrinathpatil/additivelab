import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      clerkId: v.string(),
      username: v.string(),
      email: v.string(),
      role: v.union(v.literal("admin"), v.literal("user")),
      cartId: v.optional(v.id("carts")),
    }).index("by_email", ["email"]),

    products: defineTable({
      title: v.string(),
      description: v.string(),
      longDescription: v.string(),
      stock: v.number(),
      price: v.number(),
      mrp: v.number(),
      rating: v.number(),
      reviewCount: v.number(),
      category: v.string(),
      imageUrl: v.string(),
      images: v.array(v.string()),
      features: v.array(v.string()),
    })
      .index("by_title", ["title"])
      .index("by_price", ["price"])
      .index("by_rating", ["rating"]),

    reviews: defineTable({
      productId: v.id("products"),
      userId: v.id("users"),
      userName: v.string(),
      rating: v.number(),
      comment: v.string(),
      date: v.string(),
    }).index("by_product", ["productId"]),

    orders: defineTable({
      userId: v.id("users"),
      orderNumber: v.string(),
      dates: v.object({
        placed: v.string(),
        processed: v.string(),
        shipped: v.string(),
        delivered: v.string(),
      }),
      items: v.array(
        v.object({
          productId: v.id("products"),
          quantity: v.number(),
          imageUrl: v.string(),
          price: v.number(),
        })
      ),
      subtotal: v.number(),
      tax: v.number(),
      shippingCost: v.number(),
      total: v.number(),
      shippingAddress: v.id("addresses"),
      status: v.union(
        v.literal("Processing"),
        v.literal("Shipped"),
        v.literal("Delivered"),
        v.literal("Cancelled")
      ),
    }).index("by_user", ["userId"]),

    addresses: defineTable({
      userId: v.id("users"),
      firstName: v.string(),
      lastName: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      country: v.string(),
    }).index("by_user", ["userId"]),

    notifications: defineTable({
      type: v.union(v.literal("OrderPlaced"), v.literal("OrderStatusChange")),
      message: v.string(),
    }).index("by_type", ["type"]),

    categories: defineTable({
      name: v.string(),
    }).index("by_name", ["name"]),

    carts: defineTable({
      userId: v.id("users"),
      items: v.array(
        v.object({
          productId: v.id("products"),
          quantity: v.number(),
          imageUrl: v.string(),
          price: v.number(),
        })
      ),
    }),
  },
  {
    schemaValidation: false,
  }
);
