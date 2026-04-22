import { cmd } from "../../utils/cmd"
import { ThemeInstallCommand } from "./install"
import { ThemeListCommand } from "./list"
import { ThemeRemoveCommand } from "./remove"

export const ThemeCommand = cmd({
  command: "theme",
  describe: "Manage themes",
  builder: (yargs) =>
    yargs
      .command(ThemeListCommand)
      .command(ThemeInstallCommand)
      .command(ThemeRemoveCommand)
      .demandCommand(),
  handler: async () => {},
})
