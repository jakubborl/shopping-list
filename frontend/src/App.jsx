import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Home from "./Home";
import Form from "./Form";
import { Route, Routes } from "react-router-dom";

import "./index.css";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/list/:id"
          element={<Form onLogout={() => setIsLoggedIn(false)} />}
        />
      </Routes>
    </div>
  );
}

export default App;
