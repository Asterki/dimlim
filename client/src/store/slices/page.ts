import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
    name: "page",
    initialState: {
        currentUser: null,
        language: "en",
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { setLanguage, setUser } = pageSlice.actions;
export default pageSlice.reducer;
