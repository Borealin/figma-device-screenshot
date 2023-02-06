import { fileCommands, handleFile } from "./file";
import { generalCommands, handleGeneral } from "./general";
import { HandleParams, HandleReturn } from "./global";
import { shellCommands, handleShell } from "./shell";

const allADBCommandImpls = {
  ...generalCommands,
  ...shellCommands,
  ...fileCommands,
};
export type AllADBCommandDefine = typeof allADBCommandImpls;

const allADBHandle = [handleGeneral, handleShell, handleFile];

export async function adbCommand<T extends keyof AllADBCommandDefine>(
  command: T,
  params: HandleParams<AllADBCommandDefine, T>
): HandleReturn<AllADBCommandDefine, T>;
export async function adbCommand(command: string, params: any): Promise<any> {
  for (const handle of allADBHandle) {
    const res = await handle(command, params);
    if (res.matched) {
      return res.result;
    }
  }
  throw new Error(`Unknown command: ${command}`);
}
