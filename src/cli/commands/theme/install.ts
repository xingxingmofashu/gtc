import { log } from "@clack/prompts"
import { useTheme } from "../../../theme"
import { cmd } from "../../utils/cmd"
import { UI } from "../../utils/ui"

export const ThemeInstallCommand = cmd({
  command: "install <slug>",
  describe: "Install a theme by slug",
  builder: (yargs) =>
    yargs.positional("slug", {
      type: "string",
      demandOption: true,
      description: "The slug of the theme to install",
    }),
  handler: async (argv) => {
    try {
      const { install, get } = useTheme()
      const theme = await get(argv.slug)
      if (!theme) {
        log.error(`Theme with slug ${UI.Style.TEXT_HIGHLIGHT}${argv.slug}${UI.Style.TEXT_END} not found.`)
        return
      }
      await install(theme)
      log.success(`Theme ${UI.Style.TEXT_HIGHLIGHT}${argv.slug}${UI.Style.TEXT_END} installed successfully.`)
    } catch (error) {
      log.error(`Error installing theme: ${(error as Error).message}`)
    }
  },
})
