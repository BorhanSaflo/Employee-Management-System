import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";

// Example router with queries that can only be hit if the user requesting is signed in
export const companyRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.company.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                employees: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  })
  .query("byName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      const company = await ctx.prisma.company.findFirst({
        where: {
          userId: ctx.session.user.id,
          name: input.name,
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No company with the name '${input.name}' found`,
        });
      }
      return company;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.company.create({
          data: {
            name: input.name,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.company.delete({
          where: {
            id: input.id,
          },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
      }
    },
  });
