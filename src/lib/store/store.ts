// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import type { PersistState } from "redux-persist";

import { authApi } from "../../api/authApi";
import { userApi } from "../../api/userApi";
import { hubApi } from "../../api/hubApi";
import { deliveryApi } from "../../api/deliveryApi";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "../../features/auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "../persistStorage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [hubApi.reducerPath]: hubApi.reducer,
  [deliveryApi.reducerPath]: deliveryApi.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      hubApi.middleware,
      deliveryApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState> & {
  _persist?: PersistState;
};

export type AppDispatch = typeof store.dispatch;
