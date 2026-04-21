import { cmd } from "../utils/cmd"
import { log, autocomplete, group, type Option, intro, outro, text } from "@clack/prompts"
import { useConfig } from "../../config"
import { CONFIGURATIONS } from "../../config/constants"
import { UI } from "../utils/ui"
import { useTheme } from "../../theme"

export const SetCommand = cmd({
  command: "set",
  describe: "Set a ghostty configuration",
  handler: async () => {
    try {
      intro("Set a Ghostty Configuration")
      const { key, value } = await group<{ key: string | symbol; value: string | symbol }>({
        key: () =>
          autocomplete({
            message: "Select a configuration to set",
            options: CONFIGURATIONS.map((c) => ({
              value: c.key,
              hint: c.href,
            })) as Option<string>[],
          }),
        value: async ({ results }) => {
          if (results.key === "theme") {
            const { local } = useTheme()
            const themes = await local()
            return autocomplete({
              message: "Select a theme to set",
              options: themes.map((t) => ({
                value: t.slug,
                label: t.title,
                hint: t.description,
              })) as Option<string>[],
            })
          }
          return text({
            message: "Set the configuration value",
            placeholder: results.key?.replace(/@.+$/, "").toLowerCase() ?? "",
          })
        },
      })

      const { set } = useConfig()
      await set(key, value)

      log.success(
        `Configuration ${UI.Style.TEXT_HIGHLIGHT}${key}${UI.Style.TEXT_END} set to ${UI.Style.TEXT_SUCCESS}${value}${UI.Style.TEXT_END}, reload Ghostty to apply the changes.`,
      )
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
