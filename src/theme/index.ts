import { $fetch } from "ofetch"
import { join } from "node:path"
import { readdir } from "node:fs/promises"
import { useConfig } from "../config"

export enum ThemeSort {
  Popular = "popular",
  Newest = "newest",
  Trending = "trending",
}

export interface ThemeRequest {
  sort?: ThemeSort
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
  async function list() {
    const CONFIGS_PER_PAGE = 24
    const { GTC_THEME_API_URL, GTC_THEME_CACHE_PATH } = useConfig()
    const themeCacheFile = Bun.file(GTC_THEME_CACHE_PATH)
    if ((await themeCacheFile.exists()) && Date.now() - themeCacheFile.lastModified < 1000 * 60 * 60) {
      return (await themeCacheFile.json()) as ThemeConfig[]
    }

    const query = {
      page: 1,
    }
    let promises: Promise<ThemeResponse>[] = []
    const { total } = await $fetch<ThemeResponse>(GTC_THEME_API_URL, {
      method: "GET",
      query,
    })
    while (query.page * CONFIGS_PER_PAGE < total) {
      promises.push(
        $fetch<ThemeResponse>(GTC_THEME_API_URL, {
          method: "GET",
          query,
        }),
      )
      query.page++
    }
    const responses = (await Promise.all(promises)).flatMap((r) => r.configs)
    await themeCacheFile.write(JSON.stringify(responses, null, 2))
    return responses
  }

  async function get(slug: string) {
    const themes = await list()
    return themes.find((t) => t.slug === slug)
  }

  async function install(theme: ThemeConfig) {
    const { GHOSTTY_THEME_DIR } = useConfig()
    const rawConfig = theme.rawConfig
    const file = Bun.file(join(GHOSTTY_THEME_DIR, theme.slug))
    await file.write(rawConfig)
  }

  function local() {
    const { GHOSTTY_THEME_DIR } = useConfig()
    return readdir(GHOSTTY_THEME_DIR)
  }

  return {
    get,
    list,
    install,
    local,
  }
}
