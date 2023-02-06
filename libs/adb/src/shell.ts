import { ADBGlobalParams, execAdb } from "./global";
const shell = async (
  params: {
    subCommand: string;
  } & ADBGlobalParams
) => {
  return await execAdb(`shell ${params.subCommand}`, params);
};

export const shellCommands = {
  shell,
};

export async function handleShell(command: string, params: any) {
  let matched = true;
  let result: any;
  switch (command) {
    case "shell":
      result = await shellCommands.shell(params);
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
