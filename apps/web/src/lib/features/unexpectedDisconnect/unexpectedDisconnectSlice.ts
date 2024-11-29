import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { conectedDeviceData, serialData } from "types/serial";
const initialState: conectedDeviceData[] = [];

const unexpectedDisconnectSlice = createSlice({
  name: "unexpectedDisconnect",
  initialState,
  reducers: {
    addUnexpectedDisconnect: (
      state,
      action: PayloadAction<conectedDeviceData>,
    ) => {
      state.push(action.payload);
    },
    removeUnexpectedDisconnect: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    },
  },
});

export const { addUnexpectedDisconnect, removeUnexpectedDisconnect } =
  unexpectedDisconnectSlice.actions;

export default unexpectedDisconnectSlice.reducer;
