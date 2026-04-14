import { log } from "@clack/prompts"
import { useConfig } from "../../config"
import { cmd } from "../utils/cmd"

export const RemoveCommand = cmd({
  command: "remove <name>",
  aliases: ["rm"],
  describe: "Remove a config from the ghostty",
  builder: (yargs) =>
    yargs.positional("name", {
      type: "string",
      describe: "The name of the ghostty configuration to remove",
      demandOption: true,
    }),
  handler: async (argv) => {
    const name = argv.name
    const { remove } = useConfig()
    try {
      await remove(name)
      log.success(`Configuration "${name}" removed successfully.`)
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : String(error)}`)
    }
  },
})
