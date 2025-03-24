import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Register({ setUserEmail, setUserImg }) {
  const Navigate = useNavigate();

  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [number, setNumber] = useState("");
  let [password, setPassword] = useState("");
  let [img, setImg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !number || !password || !img) {
      alert("please submit form data");
      return;
    }

    try {
      setUserImg(img);
      let obj = { name, email, number, password, message_id: "", img };

      await axios.post("http://localhost:3000/api/register", obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(obj);
      setUserEmail(email);
      Navigate("/home");
    } catch (err) {
      console.log("Login error =>", err);
      alert("Invalid login credentials. Please try again.");
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="border border-violet-500 rounded-lg p-5 w-6/12 flex flex-col items-center gap-10">
        <h1 className="text-center text-6xl text-slate-600">Register</h1>
        <form
          onSubmit={handleSubmit}
          className=" w-full flex flex-col gap-3 p-3 rounded-md items-center justify-center"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="email"
            placeholder="email"
          />
          <input
            onChange={(e) => setNumber(e.target.value)}
            value={number}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="phone number"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="password"
          />
          <input
            onChange={(e) => setImg(e.target.value)}
            value={img}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="image"
          />
          <button
            type="submit"
            className="border px-10 py-2 rounded-lg bg-violet-950 border-violet-700 text-slate-400 font-semibold hover:bg-violet-500 hover:text-slate-900"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
