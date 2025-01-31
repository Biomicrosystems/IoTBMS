import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFunction = mutation({
  args: {
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
    message: v.optional(v.string()),
    sendData: v.boolean(),
    streaming: v.boolean(),
  },
  handler: async (ctx, args) => {
    ctx.db.insert("deviceFunction", {
      deviceId: args.deviceId,
      name: args.name,
      description: args.description,
      command: args.command,
      typeOfFunction: args.typeOfFunction,
      blocking: args.blocking,
      userInfo: args.userInfo,
      userTypeOfEntry: args.userTypeOfEntry,
      unit: args.unit,
      symbol: args.symbol,
      format: args.format,
      maxInterval: args.maxInterval,
      minInterval: args.minInterval,
      scaleData: args.scaleData,
      message: args.message,
      sendData: args.sendData,
      streaming: args.streaming,
    });
  },
});

export const getFunctionByDeviceId = query({
  args: {
    deviceId: v.id("device"),
  },
  handler: async (ctx, args) => {
    const functions = ctx.db
      .query("deviceFunction")
      .filter((q) => q.eq(q.field("deviceId"), args.deviceId))
      .collect();

    return functions;
  },
});

export const updateDeviceFunction = mutation({
  args: {
    functionId: v.id("deviceFunction"),
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
    message: v.optional(v.string()),
    sendData: v.boolean(),
    streaming: v.boolean(),
  },
  handler: async (ctx, args) => {
    ctx.db.patch(args.functionId, {
      name: args.name,
      description: args.description,
      command: args.command,
      typeOfFunction: args.typeOfFunction,
      blocking: args.blocking,
      userInfo: args.userInfo,
      userTypeOfEntry: args.userTypeOfEntry,
      unit: args.unit,
      symbol: args.symbol,
      format: args.format,
      maxInterval: args.maxInterval,
      minInterval: args.minInterval,
      scaleData: args.scaleData,
      message: args.message,
      sendData: args.sendData,
      streaming: args.streaming,
    });
  },
});

export const deleteDeviceFunction = mutation({
  args: {
    deviceFunction: v.id("deviceFunction"),
  },
  handler: async (ctx, args) => {
    const commands = await ctx.db
      .query("command")
      .filter((q) => q.eq(q.field("deviceFunctionId"), args.deviceFunction))
      .collect();
    commands.forEach(async (command) => await ctx.db.delete(command._id));
    ctx.db.delete(args.deviceFunction);
  },
});
