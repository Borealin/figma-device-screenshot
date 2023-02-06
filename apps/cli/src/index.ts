#! /usr/bin/env node

import { Command, program } from "commander";
import { ServerCommand } from "./server";
import { CommandRegistry } from "./command-define";
const commands: CommandRegistry[] = [ServerCommand];
declare module "commander" {
  interface Command {
    register: () => this;
  }
}
Command.prototype.register = function (this: Command) {
  return commands.reduce((cli, command) => command.handle(cli), this);
};
program
  .name("figma-adb-server")
  .description("CLI to start local adb server for figma plugin")
  .version("0.0.1")
  .register()
  .parse();
