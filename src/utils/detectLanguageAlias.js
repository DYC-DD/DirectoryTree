import i18n from "../i18n";

const languageAliasMap = {
  // 繁體中文
  "zh-TW": "zhhant",
  "zh-HK": "zhhant",
  "zh-MO": "zhhant",
  "zh-Hant": "zhhant",

  // 簡體中文
  "zh-CN": "zhhans",
  "zh-SG": "zhhans",
  "zh-Hans": "zhhans",

  // 英文（泛用）
  en: "en",
  "en-US": "en",
  "en-GB": "en",
  "en-AU": "en",
  "en-CA": "en",
  "en-NZ": "en",
  "en-IN": "en",
  "en-SG": "en",

  // 日文
  ja: "ja",
  "ja-JP": "ja",

  // 韓文
  ko: "ko",
  "ko-KR": "ko",

  // 西班牙文
  es: "es",
  "es-ES": "es",
  "es-MX": "es",
  "es-AR": "es",
  "es-CL": "es",
  "es-CO": "es",
  "es-PE": "es",

  // 法文
  fr: "fr",
  "fr-FR": "fr",
  "fr-BE": "fr",
  "fr-CA": "fr",
  "fr-CH": "fr",

  // 德文
  de: "de",
  "de-DE": "de",
  "de-AT": "de",
  "de-CH": "de",

  // 印地語
  hi: "hi",
  "hi-IN": "hi",
};

export default function detectAndApplyLanguageAlias() {
  const detectedLng = i18n.language;
  const baseLng = detectedLng.split("-")[0];
  const alias = languageAliasMap[detectedLng] || languageAliasMap[baseLng];

  if (alias && alias !== i18n.language) {
    i18n.changeLanguage(alias);
  }
}
