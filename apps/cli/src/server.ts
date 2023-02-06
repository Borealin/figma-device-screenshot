import { Command } from "commander";
import { CommandRegistry } from "./command-define";
import { startServer } from "figma-device-screenshot-server";
export const ServerCommand: CommandRegistry = {
  handle(program: Command): Command {
    program
      .command("server")
      .description("Start the server")
      .action(async () => {
        await startServer();
      });

    return program;
  },
};
