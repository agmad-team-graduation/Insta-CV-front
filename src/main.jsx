import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@/common/styles/index.css"
import App from './App.jsx'
import React from 'react'
import { CookiesProvider } from 'react-cookie';
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </CookiesProvider>
  </StrictMode>,
)
