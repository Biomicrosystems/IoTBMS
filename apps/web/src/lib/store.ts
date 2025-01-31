import { configureStore } from "@reduxjs/toolkit";
import conectedDeviceReducer from "./features/conectedDevices/conectedDevicesSlice";
import filteredSerialDataSlice from "./features/filteredSerialData/filteredSerialDataSlice";
import databaseDataReducer from "./features/databaseData/dataBaseDataSlice";
import deviceFunctionClientDataSlice from "./features/deviceFunctionClientData/deviceFunctionClientDataSlice";
import fileEnqueuReducer from "./features/fileQueue/fileQueueSlice";
import rawSerialDataReducer from "./features/rawSerialData/rawSerialDataSlice";
import unexpectedDisconnectReducer from "./features/unexpectedDisconnect/unexpectedDisconnectSlice";
const makeStore = () => {
  return configureStore({
    reducer: {
      conectedDevice: conectedDeviceReducer,
      filteredSerialData: filteredSerialDataSlice,
      databaseData: databaseDataReducer,
      deviceFunctionClientData: deviceFunctionClientDataSlice,
      fileEnqueu: fileEnqueuReducer,
      rawSerialData: rawSerialDataReducer,
      unexpectedDisconnect: unexpectedDisconnectReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const storeInstace = makeStore();
