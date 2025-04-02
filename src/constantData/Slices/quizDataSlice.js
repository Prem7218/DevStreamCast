import { createSlice } from "@reduxjs/toolkit";

const quizDataSlice = createSlice({
  name: "quizData",
  initialState: {
    selectedLanguage: "",
    customLanguage: "",
    level: "",
    challengeType: "",
    numQns: 0,
    timePerQns: 0,
    user: "",
    qnsLen: 0,
    quizQnsAns: ``,
    question: [],
    remainingQns: 0,
    currentQns: 0,
    selectedAns: null,
    savedAns: {},
    time: 0,
    totalSco: 0,
    heigh: 0,
  },
  reducers: {
    fillQuizData: (state, action) => {
      return { ...state, ...action.payload };
    },

    clearQuizData: (state) => {
      return {
        selectedLanguage: "",
        customLanguage: "",
        level: "",
        challengeType: "",
        numQns: 0,
        timePerQns: 0,
        user: "",
        qnsLen: 0,
        quizQnsAns: ``,
        question: [],
        remainingQns: 0,
        currentQns: 0,
        selectedAns: null,
        savedAns: {},
        time: 0,
        totalSco: 0,
        heigh: 0,
      };
    },
  },
});

export const { fillQuizData, clearQuizData } = quizDataSlice.actions;
export default quizDataSlice.reducer;
