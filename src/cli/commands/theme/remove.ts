import { intro, log, autocomplete } from "@clack/prompts"
import { useTheme } from "../../../theme"
import { cmd } from "../../utils/cmd"

export const ThemeRemoveCommand = cmd({
  command: "remove",
  describe: "Remove a theme",
  handler: async () => {
    try {
      const { remove, local } = useTheme()
      const themes = await local()
      intro(`Available themes:`)
      const theme = await autocomplete({
        message: "Select a theme to remove",
        options: themes.map((t) => ({ label: t.title, value: t.slug, hint: t.description })),
      })
      if (typeof theme === "symbol") {
        log.error("Operation cancelled")
        return
      }
      await remove(theme)
      log.success(`Theme removed successfully`)
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "Unknown error occurred"}`)
    }
  },
})
