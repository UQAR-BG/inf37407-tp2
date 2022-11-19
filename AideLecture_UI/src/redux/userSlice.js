import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout,
  getUsers,
  getResults,
  postCreateParticipant,
  postAddResult,
  patchParticipant,
  deleteUser,
} from "../apis/userApi";

const initialState = {
  users: [],
  usersWithResults: [],
  authenticatedUser: JSON.parse(localStorage.getItem("authenticatedUser")),
  selectedUserForUpdate: JSON.parse(
    localStorage.getItem("selectedUserForUpdate")
  ),
};

export const postLogin = createAsyncThunk(
  "user/postLogin",
  async (loginData) => {
    const response = await login(loginData);
    return response.data;
  }
);

export const postLogout = createAsyncThunk("user/postLogout", async () => {
  const response = await logout();
  return response.data;
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await getUsers();
  return response.data;
});

export const addParticipant = createAsyncThunk(
  "user/addParticipant",
  async (participant) => {
    const response = await postCreateParticipant(participant);
    return response.data;
  }
);

export const addResult = createAsyncThunk("user/addResult", async (result) => {
  const response = await postAddResult(result);
  return response.data;
});

export const editParticipant = createAsyncThunk(
  "user/editParticipant",
  async ({ id, data }) => {
    const response = await patchParticipant(id, data);
    return response.data;
  }
);

export const deleteParticipant = createAsyncThunk(
  "user/deleteParticipant",
  async (participant) => {
    const response = await deleteUser(participant.id);
    return response.data;
  }
);

export const fetchUsersWithResults = createAsyncThunk(
  "user/fetchUsersWithResults",
  async () => {
    var response = await getUsers(false);
    var users = response.data;

    response = await getResults();
    var results = response.data;

    var resultsPerUser = users.map((user) => {
      var quizzesAnswers = {};
      var attemptsToInclude = results.filter((attempt) => {
        return attempt.userId === user.id;
      });
      var quizzesToInclude = [
        ...new Set(attemptsToInclude.map((attempts) => attempts.quizId)),
      ];

      var attempts = quizzesToInclude.map((quizId) => {
        var formattedAttemptsForQuiz = {};
        var attemptsForQuiz = attemptsToInclude.filter((attempt) => {
          return attempt.quizId === quizId;
        });

        formattedAttemptsForQuiz[quizId.toString()] = attemptsForQuiz.map(
          (attempt) => {
            var choices = {};
            attempt.choices.forEach((choice) => {
              choices[choice.questionId.toString()] = choice.answerId;
            });

            return {
              datetime: attempt.datetime,
              choices: choices,
              score: attempt.score,
            };
          }
        );
        return formattedAttemptsForQuiz;
      });

      attempts.forEach((attemptsPerQuiz) => {
        var quizId = Object.keys(attemptsPerQuiz)[0];
        quizzesAnswers[quizId.toString()] = attemptsPerQuiz[quizId];
      });

      return quizzesAnswers;
    });

    if (resultsPerUser) {
      users.forEach((user, index) => {
        if (
          resultsPerUser[index] &&
          Object.keys(resultsPerUser[index]).length > 0
        ) {
          users[index]["quizzesAnswers"] = resultsPerUser[index];
        }
      });
    }

    return users;
  }
);

/*
  La librairie Redux-Toolkit simplifie l'utilisation de Redux
  et nous évite d'avoir besoin de créer des action creators et des
  actions pour chaque opération sur le state. Il suffit de créer un
  slice dans le store de Redux avec la méthode createSlice() et d'y
  définir les reducers, le state initial et le nom du slice dans le store.
*/
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.authenticatedUser = null;
      state.selectedUserForUpdate = null;
      localStorage.clear();
    },
    focusUserForUpdate: (state, action) => {
      state.selectedUserForUpdate = action.payload;
      localStorage.setItem(
        "selectedUserForUpdate",
        JSON.stringify(action.payload)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.fulfilled, (state, action) => {
        state.authenticatedUser = action.payload;
        state.selectedUserForUpdate = action.payload;
        localStorage.setItem(
          "authenticatedUser",
          JSON.stringify(action.payload)
        );
        localStorage.setItem(
          "selectedUserForUpdate",
          JSON.stringify(action.payload)
        );
      })
      .addCase(postLogout.fulfilled, (state) => {
        state.authenticatedUser = null;
        state.selectedUserForUpdate = null;
        localStorage.clear();
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addParticipant.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.authenticatedUser = action.payload;
        localStorage.setItem(
          "authenticatedUser",
          JSON.stringify(action.payload)
        );
      })
      .addCase(editParticipant.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user.id !== action.payload.deletedId
        );
      })
      .addCase(fetchUsersWithResults.fulfilled, (state, action) => {
        state.usersWithResults = action.payload;
      });
  },
});

export const { logoutAction, focusUserForUpdate } = userSlice.actions;

export const selectUsers = (state) => state.user.users;
export const selectUsersWithResults = (state) => state.user.usersWithResults;
export const authenticatedUser = (state) => state.user.authenticatedUser;
export const selectedUser = (state) => state.user.selectedUserForUpdate;

export default userSlice.reducer;
