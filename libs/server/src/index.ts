import express, { Express } from "express";
import { RootServerRegistry } from "./root";
import { StaticImageServerRegistry } from "./static-image";
import { ADBServerRegistry } from "./adb";
import { CorsServerRegistry } from "./cors";
import { JSONServerRegistry } from "./json";
export type ServerRegistry = {
  handle: (program: Express) => Promise<Express> | Express;
};
const serverRegistries: ServerRegistry[] = [
  CorsServerRegistry,
  // JSONServerRegistry,
  RootServerRegistry,
  StaticImageServerRegistry,
  ADBServerRegistry,
];
const createApp = async () => {
  const app = express();
  return await serverRegistries.reduce(
    async (app, registry) => await registry.handle(await app),
    Promise.resolve(app)
  );
};

export const startServer = async (port: number = 3000) => {
  const app = await createApp();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
};
