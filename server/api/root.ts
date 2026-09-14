import { router } from "./trpc";
import { gearRouter } from "./routers/gear";

export const appRouter = router({
  gear: gearRouter,
});

export type AppRouter = typeof appRouter;
