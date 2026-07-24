import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Home from "./Home";
import Form from "./Form";
import { Route, Routes } from "react-router-dom";

import "./index.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="lednice" element={<Form nazev="lednice" />} />
        <Route path="skrin" element={<Form nazev="skrin" />} />
        <Route path="nakup" element={<Form nazev="nakup" showButton />} />
      </Routes>
    </div>
  );
}

export default App;
