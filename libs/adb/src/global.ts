import { exec } from "child_process";
import { promisify } from "util";

const commandBuilder = async (command: string, params: ADBGlobalParams) =>
  `adb${
    params.serialDevices
      ? params.serialDevices.map((serial) => ` -s ${serial}`)
      : ""
  }${
    params.transportIdDevices
      ? params.transportIdDevices.map((transport) => ` -t ${transport}`)
      : ""
  } ${command}`;
const execPromise = async (command: string) => {
  try {
    const withChild = await promisify(exec)(command, {
      encoding: "buffer",
      maxBuffer: 1024 * 1024 * 1024,
    });
    return withChild.stdout;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export type ADBGlobalParams = {
  serialDevices?: string[];
  transportIdDevices?: string[];
};

export type ADBGlobalResult = {};

export const execAdb = async (
  command: string,
  param: ADBGlobalParams
): Promise<Buffer | null> => {
  return await execPromise(await commandBuilder(command, param));
};

export type HandleParams<
  T extends { [k: string]: (...args: any) => any },
  K extends keyof T
> = Parameters<T[K]>[0];

export type HandleReturn<
  T extends { [k: string]: (...args: any) => any },
  K extends keyof T
> = Promise<Awaited<ReturnType<T[K]>>>;
