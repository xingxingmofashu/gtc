import { $ } from "bun"

export interface FontFamily {
  family: string
  variants: string[]
}

export function useFont() {
  async function list(): Promise<FontFamily[]> {
    const output = await $`ghostty +list-fonts`.text()

    return output
      .split("\n")
      .filter((line) => line !== "")
      .reduce<FontFamily[]>((acc, line) => {
        if (line.startsWith(" ")) {
          acc.at(-1)?.variants.push(line.trim())
        } else {
          acc.push({ family: line.trim(), variants: [] })
        }
        return acc
      }, [])
  }

  return {
    list,
  }
}
