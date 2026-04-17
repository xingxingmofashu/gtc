import { defu } from "defu"
import { $fetch } from "ofetch"
import os from "node:os"
import { join } from "node:path"
import { readdir } from "node:fs/promises"

export enum ThemeSort {
  Popular = "popular",
  Newest = "newest",
  Trending = "trending",
}

export interface ThemeRequest {
  sort?: ThemeSort
  page?: number
  tag?: string
  dark?: boolean
  q?: string
}

export interface ThemeConfig {
  id: string
  slug: string
  title: string
  description?: string
  rawConfig: string
  background: string
  foreground: string
  cursorColor: string
  cursorText?: string
  selectionBg: string
  selectionFg: string
  palette: string[]
  fontFamily?: string
  fontSize?: number
  cursorStyle: "block" | "bar" | "underline"
  bgOpacity: number
  isDark: boolean
  tags: string[]
  sourceUrl?: string
  authorName?: string
  authorUrl?: string
  isFeatured: boolean
  isSeed: boolean
  voteCount: number
  viewCount: number
  downloadCount: number
  createdAt: string
  updatedAt: string
}

export interface ThemeResponse {
  configs: ThemeConfig[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export function useTheme() {
  const themeDir = join(os.homedir(), ".config", "ghostty", "themes")

  const baseUrl = process.env.GTC_THEME_API_URL || "https://ghostty-style.vercel.app/api/config"

  async function get(params?: ThemeRequest) {
    const query = defu(params, {
      sort: ThemeSort.Popular,
      page: 1,
    })

    return await $fetch<ThemeResponse>(baseUrl, {
      method: "GET",
      query,
    })
  }

  async function install(theme: ThemeConfig) {
    const rawConfig = theme.rawConfig
    const file = Bun.file(join(themeDir, theme.slug))
    await file.write(rawConfig)
  }

  function local() {
    return readdir(themeDir)
  }

  return {
    get,
    install,
    local,
  }
}
