import { cmd } from "../../utils/cmd"
import { useTheme } from "../../../theme"
import { autocomplete, log, outro, type Option } from "@clack/prompts"
import { useConfig } from "../../../config"
import { UI } from "../../utils/ui"
import clipboardy from "clipboardy"
import pkg from "../../../../package.json"

export const ThemeListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: `list themes`,
  handler: async () => {
    try {
      const { list } = useTheme()
      const { GTC_THEME_BASE_URL } = useConfig()
      const themes = await list()

      log.info(`Theme source: ${UI.Style.TEXT_DIM}${GTC_THEME_BASE_URL}`)
      const theme = await autocomplete({
        message: "Select a theme to install",
        options: themes.map((t) => ({
          value: t.slug,
          label: t.title,
        })) as Option<string>[],
      })

      if (theme && typeof theme === "string") {
        await clipboardy.write(theme)
      }
      outro(
        `Theme ${UI.Style.TEXT_SUCCESS}${theme.toString()}${UI.Style.TEXT_END} copied to clipboard, run ${UI.Style.TEXT_INFO_BOLD}${pkg.name} theme install ${theme.toString()}${UI.Style.TEXT_END} to install it.`,
      )
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
