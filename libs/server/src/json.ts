import { json } from "express";
import { ServerRegistry } from ".";

export const JSONServerRegistry: ServerRegistry = {
  handle: (app) => {
    app.use(json);
    return app;
  },
};
