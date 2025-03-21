import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
    name: "profile",
    initialState: {
        userProfiles: []
    },
    reducers: {
        setProfiles: (state, action) => {
            state.userProfiles = action.payload;
        },

        addProfile: (state, action) => {
            state.userProfiles.push(action.payload);
        },

        updateProfile: (state, action) => {
            const updatedProfile = action.payload; 
            const index = state.userProfiles.findIndex(user => user.id === updatedProfile.id);
            if (index !== -1) {
                state.userProfiles[index] = updatedProfile; 
            }
        },        

        deleteProfile: (state, action) => {
            state.userProfiles = state.userProfiles.filter(user => user.id !== action.payload);
        },

        resetProfiles: (state) => {
            state.userProfiles = [];
        }
    }
});

export const { setProfiles, addProfile, updateProfile, deleteProfile, resetProfiles } = ProfileSlice.actions;
export default ProfileSlice.reducer;
