import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";

export const employeeRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
      companyId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const employee = await ctx.prisma.employee.findFirst({
        where: {
          id: input.id,
          companyId: input.companyId,
          managerId: ctx.session.user.id,
        },
        include: {
          tasks: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });
      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No employee with the id '${input.id}' found`,
        });
      }
      return employee;
    },
  })
  .mutation("create", {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      companyId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const employee = await ctx.prisma.employee.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          company: {
            connect: {
              id: input.companyId,
            },
          },
          manager: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return employee;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.employee.delete({
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
