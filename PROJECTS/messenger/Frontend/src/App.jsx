import React, { useMemo, useState } from "react";
import { useNavigation, Route, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";

function App() {
  let [userEmail, setUserEmail] = useState("");
  let [img, setUserImg] = useState("");

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Login setUserEmail={setUserEmail} setUserImg={setUserImg} />
          }
        />
        <Route
          path="/register"
          element={
            <Register setUserEmail={setUserEmail} setUserImg={setUserImg} />
          }
        />
        <Route
          path="/home"
          element={<Home userEmail={userEmail} img={img} />}
        />
      </Routes>
    </>
  );
}

export default App;
