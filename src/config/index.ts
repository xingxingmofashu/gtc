import os from "os"
import { join } from "path"
import { CONFIGURATIONS } from "./constants"

export type GhosttyConfigKeys = (typeof CONFIGURATIONS)[number]["key"]

export function useConfig() {
  const GTC_THEME_BASE_URL = process.env.GTC_THEME_BASE_URL || "https://ghostty-style.vercel.app"
  const GTC_THEME_API_URL =
    process.env.GTC_THEME_API_URL || "https://ghostty-style.vercel.app/api/configs"

  const GHOSTTY_CONFIG_PATH = join(os.homedir(), ".config", "ghostty", "config")
  const GHOSTTY_THEME_DIR = join(os.homedir(), ".config", "ghostty", "themes")

  const GTC_DIR = join(os.homedir(), ".config", "gtc")
  const GTC_THEME_CACHE_PATH = join(GTC_DIR, "cache", "themes.json")
  const GTC_FONT_CACHE_PATH = join(GTC_DIR, "cache", "fonts.json")

  async function get(key?: string) {
    const file = Bun.file(GHOSTTY_CONFIG_PATH)
    if (!(await file.exists())) {
      throw new Error("No ghostty config found")
    }
    const content = await file.text()
    const configurations = content
      .split("\n")
      .filter(Boolean)
      .filter((line) => !line.startsWith("#"))
      .map((config) => {
        const [key, value] = config
          .split("=")
          .map((c) => c.trim())
          .filter(Boolean)
        return { key, value } as { key: string; value: string }
      })

    if (key) {
      return configurations.filter((c) => c.key.includes(key))
    }
    return configurations
  }

  async function exists(key: string) {
    const keys = CONFIGURATIONS.map((c) => c.key)
    return keys.some((c) => c === key)
  }

  async function set(key: GhosttyConfigKeys, value: string) {
    if (!(await exists(key))) {
      throw new Error(`Invalid configuration key: ${key}`)
    }
    const file = Bun.file(GHOSTTY_CONFIG_PATH)
    if (!(await file.exists())) {
      await file.write("")
    }
    const content = (await file.text()).split("\n").filter(Boolean)
    const index = content.findIndex((line) => line.startsWith(`${key}`))
    if (index !== -1) {
      content[index] = `${key} = ${value}`
      await file.write(content.join("\n"))
    } else {
      content.push(`${key} = ${value}`)
      await file.write(content.join("\n"))
    }
  }

  async function remove(key: string) {
    const file = Bun.file(GHOSTTY_CONFIG_PATH)
    if (!(await file.exists())) {
      throw new Error("No ghostty config found")
    }
    const content = (await file.text()).split("\n").filter(Boolean)
    const index = content.findIndex((line) => line.startsWith(`${key}`))
    if (index !== -1) {
      // Count consecutive comment lines immediately above the config line
      let commentStart = index
      while (commentStart > 0 && content[commentStart - 1]?.startsWith("#")) {
        commentStart--
      }
      content.splice(commentStart, index - commentStart + 1)
      await file.write(content.join("\n"))
    } else {
      throw new Error(`Configuration key not found: ${key}`)
    }
  }

  return {
    GTC_THEME_BASE_URL,
    GTC_THEME_API_URL,
    GHOSTTY_THEME_DIR,
    GHOSTTY_CONFIG_PATH,
    GTC_THEME_CACHE_PATH,
    GTC_FONT_CACHE_PATH,
    get,
    set,
    remove,
    exists,
  }
}
