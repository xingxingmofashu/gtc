import { cmd } from "../../utils/cmd"
import { useTheme } from "../../../theme"
import { autocomplete, log, type Option } from "@clack/prompts"
import { UI } from "../../utils/ui"
import { useConfig } from "../../../config"

export const ThemeSetCommand = cmd({
  command: "set",
  describe: "Set the current theme",
  handler: async () => {
    try {
      const { local } = useTheme()
      const { set } = useConfig()
      const themes = await local()
      const theme = await autocomplete({
        message: "Select a theme to set",
        options: themes.map((t) => ({
          value: t.slug,
          label: t.title,
          hint: t.description,
        })) as Option<string>[],
      })

      if (typeof theme === "symbol") {
        log.error("Operation cancelled")
        return
      }

      await set("theme", theme)
      log.success(`Theme ${UI.Text.highlight(theme)} set successfully.`)
    } catch (error) {
      log.error(`Error setting theme: ${(error as Error).message}`)
    }
  },
})
