import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getQuizzes,
  getQuiz,
  postCreateQuiz,
  patchQuiz,
  deleteQuiz,
} from "../apis/quizApi";

const initialState = {
  quizzes: [],
  selectedQuiz: JSON.parse(localStorage.getItem("selectedQuiz")),
};

export const fetchQuizzes = createAsyncThunk("quiz/fetchQuizzes", async () => {
  const response = await getQuizzes();
  return response.data;
});

export const fetchQuiz = createAsyncThunk("quiz/fetchQuiz", async (id) => {
  const response = await getQuiz(id);
  return response.data;
});

export const addQuiz = createAsyncThunk(
  "quiz/addQuiz",
  async (quiz, { rejectWithValue }) => {
    try {
      const response = await postCreateQuiz(quiz);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editQuiz = createAsyncThunk(
  "quiz/editQuiz",
  async (quiz, { rejectWithValue }) => {
    try {
      const response = await patchQuiz(quiz);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const deleteQuizThunk = createAsyncThunk(
  "quiz/deleteQuizThunk",
  async (quiz, { rejectWithValue }) => {
    try {
      const response = await deleteQuiz(quiz.id);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

/*
  La librairie Redux-Toolkit simplifie l'utilisation de Redux
  et nous évite d'avoir besoin de créer des action creators et des
  actions pour chaque opération sur le state. Il suffit de créer un
  slice dans le store de Redux avec la méthode createSlice() et d'y
  définir les reducers, le state initial et le nom du slice dans le store.
*/
export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    focusQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
      localStorage.setItem("selectedQuiz", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.selectedQuiz = action.payload;
      })
      .addCase(addQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
      .addCase(editQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((quiz) =>
          quiz.id === action.payload.id ? action.payload : quiz
        );
        state.selectedQuiz = action.payload;
      })
      .addCase(deleteQuizThunk.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
          (quiz) => quiz.id !== action.payload.deletedId
        );
        state.selectedQuiz = null;
      });
  },
});

export const { focusQuiz } = quizSlice.actions;

export const selectQuizzes = (state) => state.quiz.quizzes;
export const selectQuiz = (state) => state.quiz.selectedQuiz;

export default quizSlice.reducer;
