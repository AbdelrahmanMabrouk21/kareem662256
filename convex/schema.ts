import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  messages: defineTable({
    content: v.string(),
    userId: v.id("users"),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
