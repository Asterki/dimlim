import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import LangPack from "shared/types/lang";

const languages = {
	// de: require("../../shared/locales/de").default as LangPack,
	en: require("../../shared/locales/en").default as typeof LangPack,
	// es: require("../../shared/locales/es").default as LangPack,
	// fr: require("../../shared/locales/fr").default as LangPack,
	// pr: require("../../shared/locales/pr").default as LangPack,
	initial: require("../../shared/locales/template").default as typeof LangPack,
};

interface InitialStateType {
	hostURL: string;
	lang: typeof LangPack;
}

const initialState: InitialStateType = {
	hostURL: process.env.NEXT_PUBLIC_SERVER_URL as string,
	lang: languages["initial"],
};

export const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		setLanguage: (state, value: PayloadAction<typeof LangPack>) => {
			state.lang = value.payload;
		},
	},
});

export default pageSlice.reducer;
export const { setLanguage } = pageSlice.actions;
