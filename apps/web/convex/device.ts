import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { error } from "console";

export const createDevice = mutation({
  args: { name: v.string(), description: v.string(), teamId: v.id("team") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("You dont have authorizacion");
    }

    return await ctx.db.insert("device", {
      teamId: args.teamId,
      name: args.name,
      description: args.description,
    });
  },
});

export const getdevices = query({
  args: { teamId: v.id("team") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return;
    }
    return await ctx.db
      .query("device")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();
  },
});

export const getdeviceById = query({
  args: { deviceId: v.id("device") },
  handler: async (ctx, args) => {
    const device = await ctx.db.get(args.deviceId);

    if (!device) {
      throw new Error("No device Found");
    }
    return device;
  },
});