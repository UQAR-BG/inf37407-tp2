import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getQuestionWords,
  getQuestionWord,
  postCreateQuestionWord,
  patchQuestionWord,
  deleteQuestionWord,
} from "../apis/questionWordsApi";

const initialState = {
  questionWords: [],
  selectedQuestionWord: JSON.parse(
    localStorage.getItem("selectedQuestionWord")
  ),
  words: [],
};

export const fetchQuestionWords = createAsyncThunk(
  "questionWord/fetchQuestionWords",
  async () => {
    const response = await getQuestionWords();
    return response.data;
  }
);

export const fetchQuestionWord = createAsyncThunk(
  "questionWord/fetchQuestionWord",
  async (id) => {
    const response = await getQuestionWord(id);
    return response.data;
  }
);

export const addQuestionWord = createAsyncThunk(
  "questionWord/addQuestionWord",
  async (word, { rejectWithValue }) => {
    try {
      const response = await postCreateQuestionWord(word);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editQuestionWord = createAsyncThunk(
  "questionWord/editQuestionWord",
  async (word, { rejectWithValue }) => {
    try {
      const response = await patchQuestionWord(word);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const deleteQuestionWordThunk = createAsyncThunk(
  "questionWord/deleteQuestionWordThunk",
  async (word, { rejectWithValue }) => {
    try {
      const response = await deleteQuestionWord(word.id);
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
export const questionWordSlice = createSlice({
  name: "questionWord",
  initialState,
  reducers: {
    focusQuestionWord: (state, action) => {
      state.selectedQuestionWord = action.payload;
      localStorage.setItem(
        "selectedQuestionWord",
        JSON.stringify(action.payload)
      );
    },
    setWords: (state, action) => {
      state.words = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionWords.fulfilled, (state, action) => {
        state.questionWords = action.payload;
      })
      .addCase(fetchQuestionWord.fulfilled, (state, action) => {
        state.selectedQuestionWord = action.payload;
        localStorage.setItem(
          "selectedQuestionWord",
          JSON.stringify(action.payload)
        );
      })
      .addCase(addQuestionWord.fulfilled, (state, action) => {
        state.questionWords.push(action.payload);
      })
      .addCase(editQuestionWord.fulfilled, (state, action) => {
        state.questionWords = state.questionWords.map((word) =>
          word.id === action.payload.id ? action.payload : word
        );
        state.selectedQuestionWord = action.payload;
      })
      .addCase(deleteQuestionWordThunk.fulfilled, (state, action) => {
        state.questionWords = state.questionWords.filter(
          (word) => word.id !== action.payload.deletedId
        );
        state.selectedQuestionWord = null;
      });
  },
});

export const { focusQuestionWord, setWords } = questionWordSlice.actions;

export const selectQuestionWords = (state) => state.questionWord.questionWords;
export const selectedQuestionWord = (state) =>
  state.questionWord.selectedQuestionWord;
export const selectWords = (state) => state.questionWord.words;
export const wordsCount = (state) => state.questionWord.words.length;

export default questionWordSlice.reducer;
