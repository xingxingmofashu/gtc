/**
 * UI utilities for the CLI application.
 * @link https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/cli/ui.ts
 */
export namespace UI {
  export const Style = {
    TEXT_HIGHLIGHT: "\x1b[96m",
    TEXT_HIGHLIGHT_BOLD: "\x1b[96m\x1b[1m",
    TEXT_DIM: "\x1b[90m",
    TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
    TEXT_NORMAL: "\x1b[0m",
    TEXT_NORMAL_BOLD: "\x1b[1m",
    TEXT_WARNING: "\x1b[93m",
    TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
    TEXT_DANGER: "\x1b[91m",
    TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
    TEXT_SUCCESS: "\x1b[92m",
    TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
    TEXT_INFO: "\x1b[94m",
    TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
    TEXT_END: "\x1b[0m",
  }

  export class Text {
    static highlight(text: string) {
      return `${Style.TEXT_HIGHLIGHT}${text}${Style.TEXT_END}`
    }
    static highlightBold(text: string) {
      return `${Style.TEXT_HIGHLIGHT_BOLD}${text}${Style.TEXT_END}`
    }
    static dim(text: string) {
      return `${Style.TEXT_DIM}${text}${Style.TEXT_END}`
    }
    static dimBold(text: string) {
      return `${Style.TEXT_DIM_BOLD}${text}${Style.TEXT_END}`
    }
    static normal(text: string) {
      return `${Style.TEXT_NORMAL}${text}${Style.TEXT_END}`
    }
    static normalBold(text: string) {
      return `${Style.TEXT_NORMAL_BOLD}${text}${Style.TEXT_END}`
    }
    static warning(text: string) {
      return `${Style.TEXT_WARNING}${text}${Style.TEXT_END}`
    }
    static warningBold(text: string) {
      return `${Style.TEXT_WARNING_BOLD}${text}${Style.TEXT_END}`
    }
    static danger(text: string) {
      return `${Style.TEXT_DANGER}${text}${Style.TEXT_END}`
    }
    static dangerBold(text: string) {
      return `${Style.TEXT_DANGER_BOLD}${text}${Style.TEXT_END}`
    }
    static success(text: string) {
      return `${Style.TEXT_SUCCESS}${text}${Style.TEXT_END}`
    }
    static successBold(text: string) {
      return `${Style.TEXT_SUCCESS_BOLD}${text}${Style.TEXT_END}`
    }
    static info(text: string) {
      return `${Style.TEXT_INFO}${text}${Style.TEXT_END}`
    }
    static infoBold(text: string) {
      return `${Style.TEXT_INFO_BOLD}${text}${Style.TEXT_END}`
    }
  }
}
