import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import quizReducer from "./quizSlice";
import questionReducer from "./questionSlice";
import phraseReducer from "./phraseSlice";
import questionWordsReducer from "./questionWordsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    quiz: quizReducer,
    question: questionReducer,
    phrase: phraseReducer,
    questionWord: questionWordsReducer,
  },
});
