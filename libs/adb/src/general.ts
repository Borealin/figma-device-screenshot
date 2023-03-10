import { ADBGlobalParams, execAdb } from "./global";
export type Device = {
  name: string;
  usb?: string;
  product?: string;
  model?: string;
  device?: string;
  transport_id?: string;
};

const splitLine = (line: string): Device => {
  const [name, residual] = line.split("device");
  const propMap = residual
    .trim()
    .split(" ")
    .reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      return Object.assign(acc, { [key]: value });
    }, {});
  return {
    name: name.trim(),
    ...propMap,
  };
};

const devices = async (
  params: {
    list?: boolean;
  } & ADBGlobalParams
) => {
  const stdout = await execAdb(`devices${params.list ? " -l" : ""}`, params);
  const lines = stdout
    ?.toString()
    ?.trim()
    ?.split("\n")
    ?.slice(1)
    ?.map(splitLine);
  return lines ?? [];
};

const help = async (params: ADBGlobalParams) => {
  return await execAdb(`help`, params);
};

const version = async (params: ADBGlobalParams) => {
  const stdout = await execAdb(`version`, params);
  const [
    _ = undefined,
    adbVersion = undefined,
    sdkVersion = undefined,
    installLocation = undefined,
  ] =
    stdout
      ?.toString()
      ?.trim()
      ?.match(
        /Android Debug Bridge version ([\d\.\-]+)[\s\n ]*Version ([\d\.\-]+)[\s\n ]*Installed as (.*)/
      ) ?? [];
  return {
    adbVersion,
    sdkVersion,
    installLocation,
  };
};

export const generalCommands = {
  devices,
  help,
  version,
};
export async function handleGeneral(command: string, params: any) {
  let matched = true;
  let result: any;
  switch (command) {
    case "devices":
      result = await generalCommands.devices(params);
      break;
    case "help":
      result = await generalCommands.help(params);
      break;
    case "version":
      result = await generalCommands.version(params);
      break;
    default:
      matched = false;
      break;
  }
  return {
    matched,
    result,
  };
}
