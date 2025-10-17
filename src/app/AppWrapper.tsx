"use client";

import { store, persistor } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const AppWapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <div className="w-full h-20" />
      </PersistGate>
    </Provider>
  );
};

export default AppWapper;
