import { configureStore } from "@reduxjs/toolkit";
import usersReducers from "./usersSlice";

const store = configureStore({
  reducer: {
    users: usersReducers,
  },
});

export default store;
