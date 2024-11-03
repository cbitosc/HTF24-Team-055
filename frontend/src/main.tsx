import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <App />
        </CookiesProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
