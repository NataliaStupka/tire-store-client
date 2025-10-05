import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom"; // Маршрутизатор
import { Toaster } from "react-hot-toast";

import "modern-normalize";
import { persistor, store } from "./redux/store.js"; //Імпортуємо створений стор; persistor
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // 'localStorage'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          {/* Сповіщення */}
          <Toaster
            position="top-right"
            reverseOrder={false} //Нові повідомлення додаватимуться знизу в списку
            gutter={8} //Відстань між повідомленнями
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: "",
              duration: 2000,
              style: {
                background: "#fff",
                color: "363636",
              },

              // Default options for specific types
              success: {
                duration: 4000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
