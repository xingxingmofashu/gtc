import { cmd } from "../../utils/cmd"
import { FontListCommand } from "./list"
import { FontSetCommand } from "./set"

export const FontCommand = cmd({
  command: "font",
  describe: "Manage ghostty fonts",
  builder: (yargs) => yargs.command(FontListCommand).command(FontSetCommand).demandCommand(),
  handler: async () => {},
})
