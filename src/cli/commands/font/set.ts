import { useConfig } from "../../../config"
import { useFont } from "../../../font"
import { cmd } from "../../utils/cmd"
import { autocomplete, log } from "@clack/prompts"

export const FontSetCommand = cmd({
  command: "set",
  describe: "Set the ghostty font",
  handler: async () => {
    const { list } = useFont()
    const { set } = useConfig()
    const { SPFontsDataType } = await list()
    const font = await autocomplete({
      message: "Select a font",
      options: SPFontsDataType.flatMap((font) => font.typefaces).map((typeface) => ({
        name: typeface.fullname,
        value: typeface.fullname,
        hint: typeface.designer,
      })),
    })
    if (typeof font === "symbol") {
      log.error("Operation cancelled")
      return
    }

    await set("font-family", font)
  },
})
