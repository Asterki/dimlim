import locale from "locale";

// Supported languages
const supportedLangs: any = {
    supported: ["es", "en", "de", "fr", "pr"],
    es: require("../../locales/es.js"),
    en: require("../../locales/en.js"),
    de: require("../../locales/de.js"),
    fr: require("../../locales/fr.js"),
    pr: require("../../locales/pr.js"),
};

const getLanguagePack = (header: string) => {
    // Find the best matching language
    const supported = new locale.Locales(supportedLangs.supported);
    const locales = new locale.Locales(header);
    let bestMatch = locales.best(supported);

    // Return the language pack from the folder "locales"
    return supportedLangs[bestMatch.language.toString()];
};

const getLanguage = (header: string) => {
    // Find the best matching language
    const supported = new locale.Locales(supportedLangs.supported);
    const locales = new locale.Locales(header);
    let bestMatch = locales.best(supported);

    // Return the language pack from the folder "locales"
    return bestMatch.language.toString();
};

export { getLanguagePack, getLanguage };
