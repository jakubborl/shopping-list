import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Form from "./Form";
import Login from "./Login";
import Register from "./Register";

import "./index.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <>
      {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />}
      <div className="App">
        <main>
          <Routes>
            {/* REGISTRACE */}
            <Route
              path="/register"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Register onLogin={() => setIsLoggedIn(true)} />
                )
              }
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLogin={() => setIsLoggedIn(true)} />
                )
              }
            />

            {/* HOMEPAGE */}
            <Route
              path="/"
              element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
            />

            {/* SEZNAM */}
            <Route
              path="/list/:id"
              element={isLoggedIn ? <Form /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
