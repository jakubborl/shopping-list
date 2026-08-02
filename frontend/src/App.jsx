import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Home from "./Home";
import Form from "./Form";
import { Route, Routes } from "react-router-dom";

import "./index.css";

function App() {
  // const [lists, setLists] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
  //     setLists(response.data);
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list/:id" element={<Form />} />
      </Routes>
    </div>
  );
}

{
  /* <Route path="1" element={<Form nazev="nakup" showButton />} />
<Route path="2" element={<Form nazev="lednice" />} />
<Route path="3" element={<Form nazev="skrin" />} /> */
}
export default App;
