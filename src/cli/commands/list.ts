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
      const { get, path } = await useConfig()
      const configurations = await get(args.search)

      intro(`Ghostty Configurations ${UI.Style.TEXT_DIM}${path}`)
      for (const { key, value } of configurations) {
        log.info(`${key} ${UI.Style.TEXT_DIM} ${UI.Style.TEXT_HIGHLIGHT}${value}`)
      }
      if (configurations.length === 0) {
        log.warn("No Ghostty Configuration found")
        outro(`Add Configuration with: ${pkg.name} set`)
      } else {
        outro(`${UI.Style.TEXT_HIGHLIGHT}${configurations.length}${UI.Style.TEXT_END} configuration found`)
      }
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
