import { Express } from "express";
import { ServerRegistry } from ".";

export const RootServerRegistry: ServerRegistry = {
    handle: (app: Express) => {
        app.get("/", (req, res) => {
            res.send("Hello World!");
        });
        return app;
    }
};