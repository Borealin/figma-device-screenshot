import { Command } from "commander";
import { CommandRegistry } from "./command-define";
import { startServer } from "@borealing/figma-device-screenshot-server";
export const ServerCommand: CommandRegistry = {
  handle(program: Command): Command {
    program
      .command("server")
      .description("Start the server")
      .option("-p, --port <port>", "Port to listen on", "3000")
      .action(async (options, command) => {
        const port = options.port ? parseInt(options.port) : 3000;
        await startServer(port);
      });

    return program;
  },
};
