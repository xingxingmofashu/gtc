import { useFont } from "../../../font"
import { cmd } from "../../utils/cmd"
import { intro, log, outro } from "@clack/prompts"
import { UI } from "../../utils/ui"

export const FontListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: "List available fonts",
  handler: async (_args) => {
    const { list } = useFont()
    const fonts = await list()
    intro(`Available fonts:`)
    for (const font of fonts.sort((a, b) => a.family.localeCompare(b.family))) {
      for (const variant of font.variants) {
        log.info(variant)
      }
    }
    outro(
      `Total: ${UI.Text.highlight(fonts.reduce((acc, font) => acc + font.variants.length, 0).toString())} fonts.`,
    )
  },
})
