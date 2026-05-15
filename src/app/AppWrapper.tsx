"use client";

import { store, persistor } from "../lib/store/store";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthInitializer } from "../components/shared/AuthInitializer";

const AppWapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>
          {children}
        </AuthInitializer>
        <div className="w-full h-20" />
      </PersistGate>
    </Provider>
  );
};

export default AppWapper;
