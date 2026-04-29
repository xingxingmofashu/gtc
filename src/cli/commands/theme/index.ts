import { cmd } from "../../utils/cmd"
import { ThemeSetCommand } from "./set"
import { ThemeInstallCommand } from "./install"
import { ThemeListCommand } from "./list"
import { ThemeRemoveCommand } from "./remove"

export const ThemeCommand = cmd({
  command: "theme",
  describe: "Manage ghostty themes",
  builder: (yargs) =>
    yargs
      .command(ThemeListCommand)
      .command(ThemeInstallCommand)
      .command(ThemeRemoveCommand)
      .command(ThemeSetCommand)
      .demandCommand(),
  handler: async () => {},
})
