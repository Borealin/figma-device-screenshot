import { Command } from "commander";
export type CommandRegistry = {
  handle: (program: Command) => Command;
};
