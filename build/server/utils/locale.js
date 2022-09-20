"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = exports.getLanguagePack = void 0;
const locale_1 = __importDefault(require("locale"));
// Supported languages
const supportedLangs = {
    supported: ["es", "en", "de", "fr", "pr"],
    es: require("../../locales/es.js"),
    en: require("../../locales/en.js"),
    de: require("../../locales/de.js"),
    fr: require("../../locales/fr.js"),
    pr: require("../../locales/pr.js"),
};
const getLanguagePack = (header) => {
    // Find the best matching language
    const supported = new locale_1.default.Locales(supportedLangs.supported);
    const locales = new locale_1.default.Locales(header);
    const bestMatch = locales.best(supported);
    // Return the language pack from the folder "locales"
    return supportedLangs[bestMatch.language.toString()];
};
exports.getLanguagePack = getLanguagePack;
const getLanguage = (header) => {
    // Find the best matching language
    const supported = new locale_1.default.Locales(supportedLangs.supported);
    const locales = new locale_1.default.Locales(header);
    const bestMatch = locales.best(supported);
    // Return the language pack from the folder "locales"
    return bestMatch.language.toString();
};
exports.getLanguage = getLanguage;
