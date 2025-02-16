import { configureStore } from "@reduxjs/toolkit";
import searchDataReducre from "../Slices/searchDataSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducre,
    }
});
export default appStore;