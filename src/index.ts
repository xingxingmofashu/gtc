import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import pkg from "../package.json"
import { ListCommand } from "./cli/commands/list"
import { ThemeCommand } from "./cli/commands/theme"

const cli = yargs(hideBin(process.argv))
  .parserConfiguration({ "populate--": true })
  .scriptName("gtc")
  .wrap(yargs().terminalWidth())
  .help("help", "show help")
  .alias("h", ["help"])
  .version("version", pkg.version)
  .alias("v", ["version"])
  .command(ListCommand)
  .command(ThemeCommand)
  .strict()

try {
  await cli.parse()
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exitCode = 1
} finally {
  process.exit()
}
