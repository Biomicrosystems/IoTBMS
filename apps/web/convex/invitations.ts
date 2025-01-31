import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";

export const createInvitation = mutation({
  args: {
    teamId: v.id("team"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userInvited = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (!userInvited) {
      return;
    }

    const teamData = await ctx.db.get(args.teamId);
    if (!teamData) {
      return;
    }
    const isUserInTeam = teamData.userRegistered.find(
      (users) => users === args.userId,
    );
    if (isUserInTeam) {
      return;
    }

    const invitacionAlreadyExist = await ctx.db
      .query("invitations")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
    if (invitacionAlreadyExist) {
      return;
    }
    const newInvitation = await ctx.db.insert("invitations", {
      teamId: args.teamId,
      userId: args.userId,
    });

    const scheduler = await ctx.scheduler.runAfter(
      600000000,
      internal.invitations.timerInvitation,
      { invitationID: newInvitation },
    );

    await ctx.db.patch(newInvitation, { deleteSchedulerId: scheduler });
    return {
      result: "success",
    };
  },
});

export const getInvitationByUser = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    const invitations = await ctx.db
      .query("invitations")
      .filter((q) => q.eq(q.field("userId"), user?.subject))
      .collect();
    if (invitations.length === 0) {
      return;
    }
    let teams: Doc<"team">[] = [];
    for (var i = 0; i < invitations.length; i++) {
      let actualTeam = await ctx.db.get(invitations[i].teamId);
      teams.push(actualTeam as Doc<"team">);
    }

    return { teams, invitations };
  },
});

export const setInvitationAccepted = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      return;
    }
    const team = await ctx.db.get(invitation.teamId);
    if (!team) {
      return;
    }
    await ctx.db.patch(invitation.teamId, {
      userRegistered: [...team.userRegistered, invitation.userId],
    });
    if (invitation.deleteSchedulerId) {
      await ctx.scheduler.cancel(invitation.deleteSchedulerId);
    }
    await ctx.db.delete(invitation._id);
  },
});

export const setInvitationRejected = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      return;
    }
    if (invitation.deleteSchedulerId) {
      await ctx.scheduler.cancel(invitation.deleteSchedulerId);
    }
    await ctx.db.delete(invitation._id);
  },
});

export const getUserInvitationInfoByTeamId = query({
  args: {
    teamId: v.id("team"),
  },
  handler: async (ctx, args) => {
    const invitationsByTeam = await ctx.db
      .query("invitations")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    const userInfoPromises = invitationsByTeam.map(async (invitation) => {
      return await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("userId"), invitation.userId))
        .unique();
    });

    const userInfo = await Promise.all(userInfoPromises);
    if (!userInfo) {
      return [];
    }

    const userInfoName = userInfo.map((user) => {
      return user?.userName;
    });

    return userInfoName;
  },
});

export const deleteInvitationByUserName = mutation({
  args: {
    userName: v.string(),
    teamId: v.id("team"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("userName"), args.userName))
      .unique();
    if (!user) {
      return;
    }
    const invitation = await ctx.db
      .query("invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user.userId),
          q.eq(q.field("teamId"), args.teamId),
        ),
      )
      .unique();
    if (!invitation) {
      return;
    }
    const schedulerId = invitation.deleteSchedulerId;
    await ctx.db.delete(invitation._id);
    if (!schedulerId) {
      return true;
    }
    await ctx.scheduler.cancel(schedulerId);
    return true;
  },
});

export const timerInvitation = internalMutation({
  args: {
    invitationID: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.invitationID);
  },
});
