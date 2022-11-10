import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUsers,
  postCreateParticipant,
  patchParticipant,
  deleteUser,
} from "../apis/userApi";

const initialState = {
  users: [],
  authenticatedUser: JSON.parse(localStorage.getItem("authenticatedUser")),
  selectedUserForUpdate: JSON.parse(
    localStorage.getItem("selectedUserForUpdate")
  ),
};

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await getUsers();
  return response.data;
});

export const addParticipant = createAsyncThunk(
  "user/addParticipant",
  async (participant, { rejectWithValue }) => {
    try {
      const response = await postCreateParticipant(participant);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const editParticipant = createAsyncThunk(
  "user/editParticipant",
  async (participant, { rejectWithValue }) => {
    try {
      const response = await patchParticipant(participant);
      return response.data;
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  "user/deleteParticipant",
  async (participant, { rejectWithValue }) => {
    try {
      const response = await deleteUser(participant.id);
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
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.authenticatedUser = action.payload;
      state.selectedUserForUpdate = action.payload;
      localStorage.setItem("authenticatedUser", JSON.stringify(action.payload));
      localStorage.setItem(
        "selectedUserForUpdate",
        JSON.stringify(action.payload)
      );
    },
    logout: (state) => {
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
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addParticipant.fulfilled, (state, action) => {
        state.users.push(action.payload);
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
      });
  },
});

export const { login, logout, focusUserForUpdate } = userSlice.actions;

export const selectUsers = (state) => state.user.users;
export const authenticatedUser = (state) => state.user.authenticatedUser;
export const selectedUser = (state) => state.user.selectedUserForUpdate;

export default userSlice.reducer;
