import locale from "locale";

// Supported languages
const supportedLangs: any = {
    supported: ["es", "en"],
    es: require("../../locales/es.js"),
    en: require("../../locales/en.js"),
};

const getLang = (header: string) => {
    // Find the best matching language
    const supported = new locale.Locales(supportedLangs.supported);
    const locales = new locale.Locales(header);
    let bestMatch = locales.best(supported);

    // Return the language pack from the folder "locales"
    return supportedLangs[bestMatch.language.toString()];
};

export { getLang };
