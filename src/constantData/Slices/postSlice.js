// src/redux/slices/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    allPosts: [],         // For global feed (optional)
    currentUserPost: [],  // Posts made by the logged-in user
    loading: false,
    error: null,
  },
  reducers: {
    // 🔄 All posts (if using a public feed)
    setPosts(state, action) {
      state.allPosts = action.payload;
    },
    clearPosts(state) {
      state.allPosts = [];
    },

    // 👤 Posts for the current logged-in user
    setCurrentUserPost(state, action) {
      state.currentUserPost = action.payload;
    },
    clearCurrentUserPost(state) {
      state.currentUserPost = [];
    },

    // 🔁 Optional loading/error state
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
});

export const {
  setPosts,
  clearPosts,
  setCurrentUserPost,
  clearCurrentUserPost,
  setLoading,
  setError
} = postsSlice.actions;

export default postsSlice.reducer;
