import { Express } from "express";
import { ServerRegistry } from ".";
import { adbCommand } from "figma-device-screenshot-adb";
import { imagePath } from "./static-image";
import sizeOf from "buffer-image-size";
import imageSize from "image-size";

export const ADBServerRegistry: ServerRegistry = {
  handle: (app: Express) => {
    app.get("/adb/devices", async (req, res) => {
      const devices = await adbCommand("devices", { list: true });
      res.send(devices);
    });
    app.get("/adb/screenshot-static/:deviceName", async (req, res) => {
      try {
        const deviceName = req.params.deviceName;
        const fileName = `/sdcard/${deviceName}.png`;
        const localImagePath = await imagePath();
        const localImageFilePath = `${localImagePath}/${deviceName}.png`;
        await adbCommand("shell", {
          subCommand: `screencap -p ${fileName}`,
          serialDevices: [deviceName],
        });
        await adbCommand("pull", {
          remote: [`${fileName}`],
          local: localImagePath,
        });
        await adbCommand("shell", {
          subCommand: `rm ${fileName}`,
        });
        const { width, height } = imageSize(localImageFilePath);
        res.send({
          width,
          height,
          filePath: `/image/${deviceName}.png`,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    });

    app.get("/adb/screenshot/:deviceName", async (req, res) => {
      try {
        const deviceName = req.params.deviceName;
        const imageBuffer = await adbCommand("shell", {
          subCommand: `screencap -p`,
          serialDevices: [deviceName],
        });
        if (!imageBuffer) {
          throw new Error("No image buffer");
        }
        const { width, height, type } = sizeOf(imageBuffer);
        res.send({
          width,
          height,
          bitmap: `data:image/${type};base64,${imageBuffer.toString("base64")}`,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    });
    return app;
  },
};
