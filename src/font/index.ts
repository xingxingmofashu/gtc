import { $ } from "bun"
import { useConfig } from "../config"

interface Typefaces {
  _name: string
  copy_protected: "yes" | "no"
  copyright: string
  description: string
  designer?: string
  duplicate: "yes" | "no"
  embeddable: "yes" | "no"
  enabled: "yes" | "no"
  family: string
  fullname: string
  outline: "yes" | "no"
  style: string
  trademark?: string
  unique: string
  valid: "yes" | "no"
  vendor?: string
  version: string
}
export interface SPFontsDataType {
  _name: string
  enabled: "yes" | "no"
  path: string
  type: "opentype" | "truetype"
  typefaces: Array<Typefaces>
  valid: "yes" | "no"
}

export function useFont() {
  /**
   * list all available fonts on the system, it will cache the result in a local file for faster access next time. If force is true, it will refresh the cache.
   * @param force Whether to force refresh the font list, default is false
   * @returns An array of SPFontsDataType representing the available fonts on the system
   */
  async function list(force: boolean = false) {
    const { GTC_FONT_CACHE_PATH } = useConfig()
    const fontCacheFile = Bun.file(GTC_FONT_CACHE_PATH)
    if (!force && (await fontCacheFile.exists())) {
      return (await fontCacheFile.json()) as {
        SPFontsDataType: SPFontsDataType[]
      }
    }

    const swiftCode = `
      import CoreText
      import Foundation
      let kCTFontMonoSpaceTrait: UInt32 = 1024
      let allFamilies = CTFontManagerCopyAvailableFontFamilyNames() as! [String]
      var monoPSNames: Set<String> = []
      for family in allFamilies {
        let desc = CTFontDescriptorCreateWithAttributes([kCTFontFamilyNameAttribute: family] as CFDictionary)
        if let descs = CTFontDescriptorCreateMatchingFontDescriptors(desc, nil) as? [CTFontDescriptor] {
          for d in descs {
            let ps = CTFontDescriptorCopyAttribute(d, kCTFontNameAttribute) as? String ?? ""
            let font = CTFontCreateWithName(ps as CFString, 12, nil)
            if (CTFontGetSymbolicTraits(font).rawValue & kCTFontMonoSpaceTrait) != 0 { monoPSNames.insert(ps) }
          }
        }
      }
      let data = try! JSONSerialization.data(withJSONObject: Array(monoPSNames))
      print(String(data: data, encoding: .utf8)!)
    `

    const monoPSNames = new Set<string>(
      JSON.parse((await $`echo ${swiftCode} | swift -`.text()).trim()) as string[],
    )

    const { SPFontsDataType } = (await $`system_profiler SPFontsDataType  -json`.json()) as {
      SPFontsDataType: SPFontsDataType[]
    }
    const fonts = {
      SPFontsDataType: SPFontsDataType.filter(
        (font) =>
          font.enabled === "yes" &&
          font.valid === "yes" &&
          font.typefaces.some((tf) => monoPSNames.has(tf._name)),
      ),
    }
    await fontCacheFile.write(JSON.stringify(fonts, null, 2))
    return fonts
  }

  return {
    list,
  }
}
