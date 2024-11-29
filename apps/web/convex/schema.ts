import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    userId: v.string(),
    userName: v.string(),
    firstLogin: v.boolean(),
    activeTeam: v.optional(v.id("team")),
  }).searchIndex("search_user", {
    searchField: "userName",
  }),
  command: defineTable({
    deviceFunctionId: v.id("deviceFunction"),
    status: v.string(),
    payload: v.optional(v.string()),
  }),
  device: defineTable({
    teamId: v.id("team"),
    name: v.string(),
    description: v.string(),
    files: v.array(v.union(v.id("_storage"), v.null())),
    isOnline: v.object({
      isOnline: v.boolean(),
      lastCheck: v.number(),
    }),
    conectionSchedulerId: v.optional(v.id("_scheduled_functions")),
  }),
  deviceFunction: defineTable({
    deviceId: v.id("device"),
    name: v.string(),
    description: v.string(),
    command: v.string(),
    typeOfFunction: v.string(),
    blocking: v.boolean(),
    userInfo: v.boolean(),
    userTypeOfEntry: v.optional(v.string()),
    unit: v.optional(v.string()),
    symbol: v.optional(v.string()),
    format: v.optional(v.string()),
    maxInterval: v.optional(v.number()),
    minInterval: v.optional(v.number()),
    scaleData: v.optional(v.array(v.union(v.number(), v.string()))),
    sendData: v.boolean(),
    message: v.optional(v.string()),
    streaming: v.boolean(),
  }),
  team: defineTable({
    adminId: v.string(),
    userRegistered: v.array(v.string()),
    name: v.string(),
    description: v.string(),
  }),
  invitations: defineTable({
    teamId: v.id("team"),
    userId: v.string(),
    deleteSchedulerId: v.optional(v.id("_scheduled_functions")),
  }),
});
