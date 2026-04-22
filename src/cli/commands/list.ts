import { cmd } from "../utils/cmd"
import { intro, log, outro } from "@clack/prompts"
import { UI } from "../utils/ui"
import { useConfig } from "../../config"
import pkg from "../../../package.json"

export const ListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: "List all the ghostty configurations",
  builder: (yargs) =>
    yargs.option("search", {
      type: "string",
      describe: "Search for a specific configuration by key",
    }),
  handler: async (args) => {
    try {
      const { get, GHOSTTY_CONFIG_PATH } = useConfig()
      const configurations = await get(args.search)

      intro(`Ghostty Configurations ${UI.Style.TEXT_DIM}${GHOSTTY_CONFIG_PATH}`)
      for (const { key, value } of configurations) {
        log.info(`${UI.Text.normal(key)} ${UI.Text.highlight(value)}`)
      }
      if (configurations.length === 0) {
        log.warn("No Ghostty Configuration found")
        outro(`Add Configuration with: ${pkg.name} set`)
      } else {
        outro(`${UI.Text.highlightBold(configurations.length.toString())} configuration found`)
      }
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
