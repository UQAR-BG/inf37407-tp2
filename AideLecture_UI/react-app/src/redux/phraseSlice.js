import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPhrases,
  getPhrasesFromQuiz,
  getPhrase,
  postCreatePhrase,
  patchPhrase,
  deletePhrase,
} from "../apis/phraseApi";

const initialState = {
  phrases: [],
  phrasesFromQuiz: [],
  selectedPhrase: JSON.parse(localStorage.getItem("selectedPhrase")),
  words: [],
};

export const fetchPhrases = createAsyncThunk(
  "phrase/fetchPhrases",
  async () => {
    const response = await getPhrases();
    return response.data;
  }
);

export const fetchPhrasesFromQuiz = createAsyncThunk(
  "phrase/fetchPhrasesFromQuiz",
  async (quizId) => {
    const response = await getPhrasesFromQuiz(quizId);
    return response.data;
  }
);

export const fetchPhrase = createAsyncThunk(
  "phrase/fetchPhrase",
  async (id) => {
    const response = await getPhrase(id);
    return response.data;
  }
);

export const addPhrase = createAsyncThunk(
  "phrase/addPhrase",
  async (phrase, { rejectWithValue }) => {
    try {
      const response = await postCreatePhrase(phrase);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editPhrase = createAsyncThunk(
  "phrase/editPhrase",
  async (phrase, { rejectWithValue }) => {
    try {
      const response = await patchPhrase(phrase);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const deletePhraseThunk = createAsyncThunk(
  "phrase/deletePhraseThunk",
  async (phrase, { rejectWithValue }) => {
    try {
      const response = await deletePhrase(phrase.id);
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
export const phraseSlice = createSlice({
  name: "phrase",
  initialState,
  reducers: {
    focusPhrase: (state, action) => {
      state.selectedPhrase = action.payload;
      localStorage.setItem("selectedPhrase", JSON.stringify(action.payload));
    },
    setWords: (state, action) => {
      state.words = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhrases.fulfilled, (state, action) => {
        state.phrases = action.payload;
      })
      .addCase(fetchPhrasesFromQuiz.fulfilled, (state, action) => {
        state.phrases = action.payload;
      })
      .addCase(fetchPhrase.fulfilled, (state, action) => {
        state.selectedPhrase = action.payload;
        localStorage.setItem("selectedPhrase", JSON.stringify(action.payload));
      })
      .addCase(addPhrase.fulfilled, (state, action) => {
        state.phrases.push(action.payload);
      })
      .addCase(editPhrase.fulfilled, (state, action) => {
        state.phrases = state.phrases.map((phrase) =>
          phrase.id === action.payload.id ? action.payload : phrase
        );
        state.selectedPhrase = action.payload;
      })
      .addCase(deletePhraseThunk.fulfilled, (state, action) => {
        state.phrases = state.phrases.filter(
          (phrase) => phrase.id !== action.payload.deletedId
        );
        state.phrasesFromQuiz = state.phrasesFromQuiz.filter(
          (phrase) => phrase.id !== action.payload.deletedId
        );
        state.selectedPhrase = null;
      });
  },
});

export const { focusPhrase, setWords } = phraseSlice.actions;

export const selectPhrases = (state) => state.phrase.phrases;
export const selectPhrasesFromQuiz = (state) => state.phrase.phrasesFromQuiz;
export const selectedPhrase = (state) => state.phrase.selectedPhrase;
export const selectWords = (state) => state.phrase.words;
export const wordsCount = (state) => state.phrase.words.length;

export default phraseSlice.reducer;
