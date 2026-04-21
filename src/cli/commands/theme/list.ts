import { cmd } from "../../utils/cmd"
import { useTheme } from "../../../theme"
import { intro, log, outro } from "@clack/prompts"
import { useConfig } from "../../../config"
import { UI } from "../../utils/ui"

export const ThemeListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: `list themes`,
  handler: async () => {
    try {
      const { local } = useTheme()
      const { GHOSTTY_THEME_DIR } = useConfig()
      const themes = await local()

      intro(`Theme source: ${UI.Text.dim(GHOSTTY_THEME_DIR)}`)
      for (const theme of themes) {
        log.info(`${UI.Text.highlight(theme.title)} ${UI.Text.dim(theme.description ?? "")}`)
      }
      outro(`${UI.Text.highlightBold(themes.length.toString())} theme(s) found.`)
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
