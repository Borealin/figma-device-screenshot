import { Express, Response } from "express";
import { ServerRegistry } from ".";
import { Device, adbCommand } from "@borealing/figma-device-screenshot-adb";
import { imagePath } from "./static-image";
import sizeOf from "buffer-image-size";
import imageSize from "image-size";
import { CustomError, Result } from "./result";
import { ADB_IMAGE_BUFFER_EMPTY, ADB_IMAGE_NO_SIZE } from "./error-code";

export const ADBServerRegistry: ServerRegistry = {
  handle: (app: Express) => {
    app.get("/adb/devices", async (req, res: Response<Result<Device[]>>) => {
      try {
        const devices = await adbCommand("devices", { list: true });
        res.send({
          data: devices,
        });
      } catch (e) {
        console.log(e);
        if (e instanceof CustomError) {
          res.send({
            error: e,
          });
        } else {
          res.sendStatus(500);
        }
      }
    });
    app.get(
      "/adb/screenshot-static/:deviceName",
      async (
        req,
        res: Response<
          Result<{
            width: number;
            height: number;
            filePath: string;
          }>
        >
      ) => {
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
          if (!width || !height) {
            throw new CustomError(ADB_IMAGE_NO_SIZE, "Failed to take screenshot");
          }
          res.send({
            data: {
              width,
              height,
              filePath: `/image/${deviceName}.png`,
            },
          });
        } catch (e) {
          console.log(e);
          if (e instanceof CustomError) {
            res.send({
              error: e,
            });
          } else {
            res.sendStatus(500);
          }
        }
      }
    );

    app.get(
      "/adb/screenshot/:deviceName",
      async (
        req,
        res: Response<
          Result<{
            width: number;
            height: number;
            bitmap: string;
          }>
        >
      ) => {
        try {
          const deviceName = req.params.deviceName;
          const imageBuffer = await adbCommand("shell", {
            subCommand: `screencap -p`,
            serialDevices: [deviceName],
          });
          if (!imageBuffer) {
            throw new CustomError(ADB_IMAGE_BUFFER_EMPTY, "Failed to take screenshot");
          }
          const { width, height, type } = sizeOf(imageBuffer);
          res.send({
            data: {
              width,
              height,
              bitmap: `data:image/${type};base64,${imageBuffer.toString(
                "base64"
              )}`,
            },
          });
        } catch (e) {
          console.log(e);
          if (e instanceof CustomError) {
            res.send({
              error: e,
            });
          } else {
            res.sendStatus(500);
          }
        }
      }
    );
    return app;
  },
};
