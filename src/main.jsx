import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { AuthProvider } from "@/components/utils/AuthContext"

import App from "./App.jsx"

import "bootstrap/dist/css/bootstrap.min.css"
import "@coreui/coreui/dist/css/coreui.min.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)