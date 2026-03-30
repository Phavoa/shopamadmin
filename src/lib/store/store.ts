// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import type { PersistState } from "redux-persist";
import { authApi } from "../../api/authApi";
import { userApi } from "../../api/userApi";
import { hubApi } from "../../api/hubApi";
import { deliveryApi } from "../../api/deliveryApi";
import { orderApi } from "../../api/orderApi";
import { ridersApi } from "../../api/ridersApi";
import { shipmentApi } from "../../api/shipmentApi";
import { productsApi } from "../../api/productsApi";
import { categoriesApi } from "../../api/categoriesApi";
import { adminApi } from "../../api/adminApi";
import { orderExceptionsApi } from "../../api/orderExceptionsApi";
import { referralApi } from "../../api/referralApi";
import { adminDashboardApi } from "../../api/adminDashboardApi";
import { disciplineApi } from "../../api/disciplineApi";
import { filesApi } from "../../api/filesApi";

import { liveStreamApi } from "@/api/liveStreamApi";
import { slotApi } from "@/api/slotApi";

import { livestreamCategoriesApi } from "../../api/livestreamCategoriesApi";
import { systemAlertsApi } from "../../api/systemAlertsApi";
import { revenueReportsApi } from "../../api/revenueReportsApi";
import { weeklySummaryApi } from "../../api/weeklySummaryApi";
import { feeConfigApi } from "../../api/feeConfigApi";
import { withdrawalsApi } from "../../api/withdrawalsApi";
import { supportChatApi } from "@/api/supportChatApi";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "../../features/auth/authSlice";
import headerReducer from "../../features/shared/headerSice";
import { searchReducer } from "../../features/search";
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
  [orderApi.reducerPath]: orderApi.reducer,
  [ridersApi.reducerPath]: ridersApi.reducer,
  [shipmentApi.reducerPath]: shipmentApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [orderExceptionsApi.reducerPath]: orderExceptionsApi.reducer,
  [referralApi.reducerPath]: referralApi.reducer,
  [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
  [disciplineApi.reducerPath]: disciplineApi.reducer,
  [liveStreamApi.reducerPath]: liveStreamApi.reducer,
  [slotApi.reducerPath]: slotApi.reducer,

  [filesApi.reducerPath]: filesApi.reducer,
  [livestreamCategoriesApi.reducerPath]: livestreamCategoriesApi.reducer,
  [systemAlertsApi.reducerPath]: systemAlertsApi.reducer,
  [revenueReportsApi.reducerPath]: revenueReportsApi.reducer,
  [weeklySummaryApi.reducerPath]: weeklySummaryApi.reducer,
  [feeConfigApi.reducerPath]: feeConfigApi.reducer,
  [withdrawalsApi.reducerPath]: withdrawalsApi.reducer,
  [supportChatApi.reducerPath]: supportChatApi.reducer,

  auth: authReducer,
  header: headerReducer,
  search: searchReducer,
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
      deliveryApi.middleware,
      orderApi.middleware,
      ridersApi.middleware,
      shipmentApi.middleware,
      productsApi.middleware,
      categoriesApi.middleware,
      adminApi.middleware,
      orderExceptionsApi.middleware,
      referralApi.middleware,
      adminDashboardApi.middleware,
      disciplineApi.middleware,
      liveStreamApi.middleware,
      slotApi.middleware,

      filesApi.middleware,
      livestreamCategoriesApi.middleware,
      systemAlertsApi.middleware,
      revenueReportsApi.middleware,
      weeklySummaryApi.middleware,
      feeConfigApi.middleware,
      withdrawalsApi.middleware,
      supportChatApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState> & {
  _persist?: PersistState;
};
export type AppDispatch = typeof store.dispatch;
