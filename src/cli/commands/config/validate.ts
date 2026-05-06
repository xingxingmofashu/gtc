import { log } from "@clack/prompts"
import { useConfig } from "../../../config"
import { cmd } from "../../utils/cmd"

export const ConfigValidateCommand = cmd({
  command: "validate",
  aliases: ["check"],
  describe: "Validate the ghostty configuration file",
  builder: (yargs) => yargs,
  handler: async () => {
    try {
      const { validate } = useConfig()
      await validate()
      log.success("Ghostty configuration is valid")
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
