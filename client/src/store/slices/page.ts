import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../../shared/types/models";

export const pageSlice = createSlice({
    name: "page",
    initialState: {
        currentUser: null as User | null,
        language: "en"
    },
    reducers: {
        setUser: (state, action: { payload: User | null }) => {
            state.currentUser = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        }
    }
});

export const { setLanguage, setUser } = pageSlice.actions;
export default pageSlice.reducer;
