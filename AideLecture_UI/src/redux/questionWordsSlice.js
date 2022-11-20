import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getQuestionWords,
  getQuestionWord,
  postCreateQuestionWord,
  patchQuestionWord,
  deleteQuestionWord,
} from "../apis/questionWordsApi";
import { postWord } from "../apis/wordApi";

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
  async (questionWord, { rejectWithValue }) => {
    try {
      // Appel pour créer le mot d'interrogation de base sans mots.
      const words = questionWord.words;
      questionWord.words = [];
      const newQuestionWord = await postCreateQuestionWord(questionWord);

      //Appels pour créer chaque mot avec téléversement d'image.
      for (var i = 0; i < words.length; i++) {
        words[i]["questionWordId"] = newQuestionWord.data.id;
        await postWord(words[i]);
      }

      // Appel pour récupérer le mot d'interrogation avec toutes ses informations.
      const response = await getQuestionWord(newQuestionWord.data.id);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editQuestionWord = createAsyncThunk(
  "questionWord/editQuestionWord",
  async (questionWord, { rejectWithValue }) => {
    try {
      // Appel pour créer le mot d'interrogation de base sans mots.
      const words = questionWord.words;
      questionWord.words = [];
      const updatedQuestionWord = await patchQuestionWord(questionWord);

      //Appels pour créer chaque mot avec téléversement d'image.
      for (var i = 0; i < words.length; i++) {
        words[i]["questionWordId"] = updatedQuestionWord.data.id;
        await postWord(words[i]);
      }

      // Appel pour récupérer le mot d'interrogation avec toutes ses informations.
      const response = await getQuestionWord(updatedQuestionWord.data.id);
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
    clearQuestionWord: (state) => {
      state.selectedQuestionWord = null;
      localStorage.setItem("selectedQuestionWord", "");
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

export const { focusQuestionWord, setWords, clearQuestionWord } =
  questionWordSlice.actions;

export const selectQuestionWords = (state) => state.questionWord.questionWords;
export const selectedQuestionWord = (state) =>
  state.questionWord.selectedQuestionWord;
export const selectWords = (state) => state.questionWord.words;
export const wordsCount = (state) => state.questionWord.words.length;

export default questionWordSlice.reducer;
