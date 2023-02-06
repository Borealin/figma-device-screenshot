import { ADBGlobalParams, execAdb } from "./global";

const push = async (
  params: {
    local: string[];
    remote: string;
    sync?: boolean;
    algorithm?: "any" | "none" | "brotli" | "lz4" | "zstd";
    disableCompression?: boolean;
  } & ADBGlobalParams
) => {
  return await execAdb(
    `push${params.sync ? " --sync" : ""}${
      params.algorithm ? ` -z ${params.algorithm}` : ""
    }${params.disableCompression ? " -Z" : ""} ${params.local.join(" ")} ${
      params.remote
    }`,
    params
  );
};

const pull = async (
  params: {
    remote: string[];
    local: string;
    preserveTSAndMode?: boolean;
    algorithm?: "any" | "none" | "brotli" | "lz4" | "zstd";
    disableCompression?: boolean;
  } & ADBGlobalParams
) => {
  return await execAdb(
    `pull${params.preserveTSAndMode ? " -a" : ""}${
      params.algorithm ? ` -z ${params.algorithm}` : ""
    }${params.disableCompression ? " -Z" : ""} ${params.remote.join(" ")} ${
      params.local
    }`,
    params
  );
};

export const fileCommands = {
  push,
  pull,
};

export async function handleFile(command: string, params: any) {
  let matched = true;
  let result: any;
  switch (command) {
    case "push":
      result = await fileCommands.push(params);
      break;
    case "pull":
      result = await fileCommands.pull(params);
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
