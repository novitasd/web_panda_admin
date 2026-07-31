import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/scrollbar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);