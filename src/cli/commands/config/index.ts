import { cmd } from "../../utils/cmd"
import { ConfigListCommand } from "./list"
import { ConfigRemoveCommand } from "./remove"
import { ConfigValidateCommand } from "./validate"

export const ConfigCommand = cmd({
  command: "config",
  aliases: ["cfg"],
  describe: "Manage ghostty configurations",
  builder: (yargs) =>
    yargs
      .command(ConfigListCommand)
      .command(ConfigRemoveCommand)
      .command(ConfigValidateCommand)
      .demandCommand(),
  handler: async () => {},
})
