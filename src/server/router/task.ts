import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { TRPCError } from "@trpc/server";

export const taskRouter = createProtectedRouter().mutation("create", {
  input: z.object({
    title: z.string(),
    description: z.string().nullish(),
    employeeId: z.string(),
  }),
  async resolve({ ctx, input }) {
    const task = await ctx.prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        employee: {
          connect: {
            id: input.employeeId,
          },
        },
      },
    });
    return task;
  },
});
