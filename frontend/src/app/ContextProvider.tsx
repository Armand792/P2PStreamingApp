'use client';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/index';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>{' '}
    </Provider>
  );
};

export default ContextProvider;
