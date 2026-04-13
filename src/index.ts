import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import pkg from "../package.json"

const cli = yargs(hideBin(process.argv))
  .parserConfiguration({ "populate--": true })
  .scriptName("gc")
  .wrap(yargs().terminalWidth())
  .help("help", "show help")
  .alias("h", ["help"])
  .version("version", pkg.version)
  .alias("v", ["version"])
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
