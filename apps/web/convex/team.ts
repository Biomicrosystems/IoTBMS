import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTeam = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return;
    }
    const newTeam = await ctx.db.insert("team", {
      name: args.name,
      description: args.description,
      adminId: user.subject,
      userRegistered: [user.subject],
    });
    const userId = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .unique();
    if (!userId) {
      return;
    }
    await ctx.db.patch(userId._id, { activeTeam: newTeam });
  },
});

export const getUserTeams = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    const team = await ctx.db.query("team").collect();
    const userTeam = team.filter((team) =>
      team.userRegistered.includes(user?.subject as string),
    );

    return userTeam;
  },
});

export const getTeamById = query({
  args: {
    teamId: v.id("team"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.teamId);
  },
});

export const getActiveTeamInfo = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return;
    }
    const data = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .first();
    if (!data?.activeTeam) {
      return;
    }
    return await ctx.db.get(data.activeTeam);
  },
});

export const getTeamUsersInfo = query({
  args: {
    teamId: v.id("team"),
  },
  handler: async (ctx, args) => {
    const teamInfo = await ctx.db.get(args.teamId);
    if (!teamInfo) {
      return;
    }
    const adminUser = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userId"), teamInfo.adminId))
      .unique();
    const userInfoPromises = teamInfo.userRegistered.map(async (userId) => {
      const user = await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();
      if (!user) {
        return null;
      }
      return user;
    });

    const userInfo = await Promise.all(userInfoPromises);
    if (!userInfo) {
      return {
        adminUser: adminUser?.userName,
        teamUsers: [],
      };
    }
    const filteredUserInfo = userInfo.filter(
      (user) => user?._id !== adminUser?._id,
    );

    const userNameData = filteredUserInfo.map((user) => {
      return user?.userName;
    });

    return {
      adminUser: adminUser?.userName,
      teamUsers: userNameData,
    };
  },
});

export const removeUserFromTeam = mutation({
  args: { userName: v.string(), teamId: v.id("team") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .first();
    if (!user) {
      return;
    }
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      return;
    }
    const teamUser = team.userRegistered;
    const newTeamUsers = teamUser.filter(
      (userData) => userData !== user.userId,
    );
    await ctx.db.patch(team._id, { userRegistered: newTeamUsers });
    return true;
  },
});
//----------------------------------------
//  Server Actions for usage with middleware
//----------------------------------------

export const getActiveTeamInfoWithServer = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!data?.activeTeam) {
      return;
    }
    return await ctx.db.get(data.activeTeam);
  },
});
