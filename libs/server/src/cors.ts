import cors from "cors";
import { ServerRegistry } from ".";

export const CorsServerRegistry: ServerRegistry = {
  handle: (app) => {
    app.use(
      cors({
        origin: "*",
      })
    );
    return app;
  },
};
