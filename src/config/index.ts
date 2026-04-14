import os from "os"
import { join } from "path"
import bun from "bun"
import { CONFIGURATIONS } from "./constants"

export function useConfig() {
  const path = join(os.homedir(), ".config", "ghostty", "config")

  async function get(key?: string) {
    const file = await bun.file(path)
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

  async function set(key: string, value: string) {
    if (!(await exists(key))) {
      throw new Error(`Invalid configuration key: ${key}`)
    }
    const file = await bun.file(path)
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
    const file = await bun.file(path)
    if (!(await file.exists())) {
      throw new Error("No ghostty config found")
    }
    const content = (await file.text()).split("\n").filter(Boolean)
    const index = content.findIndex((line) => line.startsWith(`${key}`))
    if (index !== -1) {
      content.splice(index, 1)
      await file.write(content.join("\n"))
    } else {
      throw new Error(`Configuration key not found: ${key}`)
    }
  }

  return {
    path,
    get,
    set,
    remove,
    exists,
  }
}
