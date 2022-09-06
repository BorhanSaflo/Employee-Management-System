// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { companyRouter } from "./company";
import { employeeRouter } from "./employee";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("company.", companyRouter)
  .merge("employee.", employeeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
