import { cmd } from "../../utils/cmd"
import { ThemeListCommand } from "./list"

export const ThemeCommand = cmd({
  command: "theme",
  describe: "Manage themes",
  builder: (yargs) => yargs.command(ThemeListCommand).demandCommand(),
  handler: async () => {},
})
