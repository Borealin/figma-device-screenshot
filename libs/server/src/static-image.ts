import express, { Express } from "express";
import { ServerRegistry } from ".";
import { mkdir, stat } from "fs/promises";
import path from "path";

const _imagePath = path.join(__dirname, "image");
export const imagePath = async () => {
  try {
    await stat(_imagePath);
  } catch (e) {
    await mkdir(_imagePath);
  }
  return _imagePath;
};

export const StaticImageServerRegistry: ServerRegistry = {
  handle: async (app: Express) => {
    app.use("/image", express.static(await imagePath(), { maxAge: 3600000 }));
    return app;
  },
};
