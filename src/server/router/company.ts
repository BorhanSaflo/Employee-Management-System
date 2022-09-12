import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";

export const companyRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.company.findMany({
          where: {
            userId: ctx.session?.user.id,
          },
          select: {
            id: true,
            name: true,
            themeColor: true,
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
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const company = await ctx.prisma.company.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.id,
        },
        include: {
          employees: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              createdAt: true,
              _count: {
                select: {
                  tasks: true,
                },
              },
            },
          },
          _count: {
            select: {
              employees: true,
            },
          },
        },
      });
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No company with the id '${input.id}' found`,
        });
      }
      return company;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      color: z.string().optional(),
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
            themeColor: input.color,
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
