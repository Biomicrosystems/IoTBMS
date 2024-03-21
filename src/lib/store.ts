import { configureStore } from "@reduxjs/toolkit";
import conectedDeviceReducer from "./features/conectedDevices/conectedDevicesSlice";
import serialDataReducer from "./features/serialData/serialDataSlice";
const makeStore = () => {
  return configureStore({
    reducer: {
      conectedDevice: conectedDeviceReducer,
      serialData: serialDataReducer,
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
