import { cmd } from "../../utils/cmd"
import { ThemeSort, useTheme } from "../../../theme"
import { autocomplete, confirm, group, log, outro, type Option } from "@clack/prompts"
import { useConfig } from "../../../config"
import { UI } from "../../utils/ui"

export const ThemeListCommand = cmd({
  command: "list",
  aliases: ["ls"],
  describe: `${UI.Style.TEXT_DIM}list themes from ${UI.Style.TEXT_INFO_BOLD}https://ghostty-style.vercel.app/ ${UI.Style.TEXT_END}`,
  builder: (yargs) =>
    yargs
      .option("search", {
        type: "string",
        description: "Search themes by keyword",
      })
      .option("sort", {
        type: "string",
        description: "Sort themes by criteria",
        choices: Object.values(ThemeSort),
        default: ThemeSort.Popular,
      })
      .option("tag", {
        type: "string",
        description: "Filter themes by tag",
      })
      .option("page", {
        type: "number",
        description: "Page number for pagination",
        default: 1,
      })
      .option("dark", {
        type: "boolean",
        description: "Filter themes by dark mode support",
        default: false,
      }),
  handler: async (argv) => {
    try {
      const { get, install } = useTheme()
      const { GTC_THEME_API_URL } = useConfig()
      const { configs } = await get({
        q: argv.search,
        sort: argv.sort as ThemeSort,
        tag: argv.tag,
        page: argv.page,
        dark: argv.dark,
      })

      log.info(
        `Theme source: ${UI.Style.TEXT_DIM}${GTC_THEME_API_URL}${UI.Style.TEXT_END}`,
      )

      const { id, isInstall, use } = await group({
        id: () =>
          autocomplete({
            message: "Select a theme to install",
            options: configs.map((c) => ({
              value: c.id,
              label: c.title,
              hint: c.sourceUrl,
            })) as Option<string>[],
          }),
        isInstall: async ({ results }) => (results.id ? confirm({ message: "Do you want install the theme?" }) : false),
        use: async ({ results }) =>
          results.isInstall ? confirm({ message: "Do you want to use the theme now?" }) : false,
      })

      if (id && isInstall) {
        const theme = configs.find((c) => c.id === id)
        if (theme) await install(theme)
        if (theme && use) {
          const { set } = useConfig()
          await set("theme", theme.slug)
        }
      }
      outro("Done!")
    } catch (error) {
      log.error(`${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  },
})
