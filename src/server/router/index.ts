// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { companyRouter } from "./company";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("company.", companyRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
