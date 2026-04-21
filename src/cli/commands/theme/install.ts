import { autocomplete, log, type Option } from "@clack/prompts"
import { useTheme } from "../../../theme"
import { cmd } from "../../utils/cmd"
import { UI } from "../../utils/ui"
import { useConfig } from "../../../config"

export const ThemeInstallCommand = cmd({
  command: "install",
  describe: "Install a theme",
  handler: async () => {
    try {
      const { install, list, get } = useTheme()
      const { GTC_THEME_BASE_URL } = useConfig()
      const themes = await list()

      log.info(`Theme source: ${UI.Text.dim(GTC_THEME_BASE_URL)}`)
      const name = await autocomplete({
        message: "Select a theme to install",
        options: themes.map((t) => ({
          value: t.slug,
          label: t.title,
          hint: t.description,
        })) as Option<string>[],
      })
      if (typeof name === "symbol") {
        log.error("Operation cancelled")
        return
      }
      const theme = await get(name)
      if (!theme) {
        log.error(`Theme "${name}" not found`)
        return
      }
      await install(theme)
      log.success(`Theme ${UI.Text.highlight(theme.title)} installed successfully.`)
    } catch (error) {
      log.error(`Error installing theme: ${(error as Error).message}`)
    }
  },
})
