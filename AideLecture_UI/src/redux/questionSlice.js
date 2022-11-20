import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getQuestions,
  getQuestionsFromQuiz,
  getQuestion,
  postCreateQuestion,
  postAnswer,
  patchQuestion,
  deleteQuestion,
} from "../apis/questionApi";
import { postWord } from "../apis/wordApi";

const initialState = {
  questions: [],
  questionsFromQuiz: [],
  selectedQuestion: JSON.parse(localStorage.getItem("selectedQuestion")),
  words: [],
  answers: [],
};

export const fetchQuestions = createAsyncThunk(
  "question/fetchQuestions",
  async () => {
    const response = await getQuestions();
    return response.data;
  }
);

export const fetchAllQuestionsFromQuiz = createAsyncThunk(
  "question/fetchAllQuestionsFromQuiz",
  async (quizId) => {
    const response = await getQuestionsFromQuiz(quizId, false);
    return response.data;
  }
);

export const fetchQuestionsFromQuiz = createAsyncThunk(
  "question/fetchQuestionsFromQuiz",
  async (quizId) => {
    const response = await getQuestionsFromQuiz(quizId);
    return response.data;
  }
);

export const fetchQuestion = createAsyncThunk(
  "question/fetchQuestion",
  async (id) => {
    const response = await getQuestion(id);
    return response.data;
  }
);

export const addQuestion = createAsyncThunk(
  "question/addQuiz",
  async (question, { rejectWithValue }) => {
    try {
      // Appel pour créer le texte de base sans mots.
      const words = question.words;
      const answers = question.answers;
      question.words = [];
      question.answers = [];
      const newQuestion = await postCreateQuestion(question);

      //Appels pour créer chaque mot avec téléversement d'image.
      for (var i = 0; i < words.length; i++) {
        words[i]["questionId"] = newQuestion.data.id;
        await postWord(words[i]);
      }

      //Appels pour créer chaque réponse avec téléversement d'image.
      for (var i = 0; i < answers.length; i++) {
        answers[i]["questionId"] = newQuestion.data.id;
        await postAnswer(answers[i]);
      }

      // Appel pour récupérer le texte avec toutes ses informations.
      const response = await getQuestion(newQuestion.data.id);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editQuestion = createAsyncThunk(
  "question/editQuestion",
  async (question, { rejectWithValue }) => {
    try {
      // Appel pour créer le texte de base sans mots.
      const words = question.words;
      const answers = question.answers;
      question.words = [];
      question.answers = [];
      const updatedQuestion = await patchQuestion(question);

      //Appels pour créer chaque mot avec téléversement d'image.
      for (var i = 0; i < words.length; i++) {
        words[i]["questionId"] = updatedQuestion.data.id;
        await postWord(words[i]);
      }

      //Appels pour créer chaque réponse avec téléversement d'image.
      for (var i = 0; i < answers.length; i++) {
        answers[i]["questionId"] = updatedQuestion.data.id;
        await postAnswer(answers[i]);
      }

      // Appel pour récupérer le texte avec toutes ses informations.
      const response = await getQuestion(updatedQuestion.data.id);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  "question/deleteQuestionThunk",
  async (question, { rejectWithValue }) => {
    try {
      const response = await deleteQuestion(question.id);
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
export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    focusQuestion: (state, action) => {
      state.selectedQuestion = action.payload;
      localStorage.setItem("selectedQuestion", JSON.stringify(action.payload));
    },
    setWords: (state, action) => {
      state.words = action.payload;
    },
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    clearQuestion: (state) => {
      state.selectedQuestion = null;
      localStorage.setItem("selectedQuestion", "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(fetchAllQuestionsFromQuiz.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsFromQuiz.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.selectedQuestion = action.payload;
        localStorage.setItem(
          "selectedQuestion",
          JSON.stringify(action.payload)
        );
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.map((question) =>
          question.id === action.payload.id ? action.payload : question
        );
        state.selectedQuestion = action.payload;
      })
      .addCase(deleteQuestionThunk.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (question) => question.id !== action.payload.deletedId
        );
        state.questionsFromQuiz = state.questionsFromQuiz.filter(
          (question) => question.id !== action.payload.deletedId
        );
        state.selectedQuestion = null;
      });
  },
});

export const { focusQuestion, setWords, setAnswers, clearQuestion } =
  questionSlice.actions;

export const selectQuestions = (state) => state.question.questions;
export const selectQuestionsFromQuiz = (state) =>
  state.question.questionsFromQuiz;
export const selectedQuestion = (state) => state.question.selectedQuestion;
export const selectWords = (state) => state.question.words;
export const wordsCount = (state) => state.question.words.length;
export const selectAnswers = (state) => state.question.answers;

export default questionSlice.reducer;
