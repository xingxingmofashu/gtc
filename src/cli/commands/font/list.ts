import { intro, log, outro } from "@clack/prompts"
import { useFont } from "../../../font"
import { cmd } from "../../utils/cmd"
import { UI } from "../../utils/ui"

export const FontListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: "List available fonts",
  builder: (yargs) =>
    yargs.option("force", {
      type: "boolean",
      description: "Force refresh the font list",
      default: false,
    }),
  handler: async (args) => {
    const { list } = useFont()
    const { SPFontsDataType } = await list(args.force)
    intro(`Available fonts:`)
    for (const font of SPFontsDataType.sort((a, b) => a._name.localeCompare(b._name))) {
      for (const typeface of font.typefaces) {
        log.info(`${typeface.fullname}`)
      }
    }
    outro(
      `Total: ${UI.Text.highlight(SPFontsDataType.reduce((acc, font) => acc + font.typefaces.length, 0).toString())}  fonts.`,
    )
  },
})
