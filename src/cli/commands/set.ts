import { cmd } from "../utils/cmd"
import { log, autocomplete, group, type Option, intro, outro, text } from "@clack/prompts"
import { useConfig } from "../../config"
import { CONFIGURATIONS } from "../../config/constants"

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
        value: ({ results }) =>
          text({
            message: "Set the configuration value",
            placeholder: results.key?.replace(/@.+$/, "").toLowerCase() ?? "",
          }),
      })

      const { set } = useConfig()
      await set(key, value)
      log.success(`Configuration ${key} set to ${value}`)
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
