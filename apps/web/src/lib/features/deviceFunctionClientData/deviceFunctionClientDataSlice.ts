import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { deviceFunctionFormType } from "types/deviceFunctionClientData";

const initialState: deviceFunctionFormType[] = [];

const deviceFunctionClientDataSlice = createSlice({
  name: "deviceFunctionClientData",
  initialState,
  reducers: {
    addDeviceFunctionClientData: (
      state,
      action: PayloadAction<deviceFunctionFormType>,
    ) => [...state, action.payload],
    cleanDeviceFunctionClientData: (state) => {
      let newArray = state.slice();
      newArray.splice(0, newArray.length);
      return newArray;
    },
    updateDeviceFunctionClientData: (
      state,
      action: PayloadAction<deviceFunctionFormType>,
    ) => {
      let newArray = state.slice();
      let indexOfTheArray = newArray.findIndex(
        (data) => data.id === action.payload.id,
      );
      newArray[indexOfTheArray] = action.payload;
      return newArray;
    },
    deleteDeviceFunctionClientData: (state, action: PayloadAction<string>) => {
      let newArray = state.slice();
      let indexOfTheArray = newArray.findIndex(
        (data) => data.id === action.payload,
      );
      newArray.splice(indexOfTheArray, 1);
      return newArray;
    },
  },
});

export const {
  addDeviceFunctionClientData,
  cleanDeviceFunctionClientData,
  updateDeviceFunctionClientData,
  deleteDeviceFunctionClientData,
} = deviceFunctionClientDataSlice.actions;

export default deviceFunctionClientDataSlice.reducer;
