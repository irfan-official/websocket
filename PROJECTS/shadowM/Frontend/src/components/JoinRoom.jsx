import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function JoinRoom() {
  const Navigate = useNavigate();

  let [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || ""
  );

  useEffect(() => {
    const check = JSON.parse(localStorage.getItem("user"));
    if (!check) {
      return Navigate("/login");
    }
    if (!userData) {
      setUserData(check);
    }
  }, []);

  let [roomName, setRoomName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!roomName) {
      alert("please submit form data");
      return;
    }

    try {
      let obj = {
        userID: userData.userID,
        roomName: roomName,
      };

      let response = await axios.post(
        "http://localhost:3000/api/v1/joinroom",
        obj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("data of requested ====>", response);

      if (!response.data.success) {
        alert(response.data.error);
        Navigate("/login");
      } else {
        Navigate("/");
      }
    } catch (err) {
      console.log("Login error =>", err);
      alert("Can not join group this time");
      Navigate("/login");
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="border border-violet-500 rounded-lg p-5 w-6/12 flex flex-col items-center gap-10">
        <h1 className="text-center text-6xl text-slate-600">Join in Room</h1>
        <form
          onSubmit={handleSubmit}
          className=" w-full flex flex-col gap-3 p-3 rounded-md items-center justify-center"
        >
          <input
            onChange={(e) => setRoomName(e.target.value)}
            value={roomName}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="room name"
          />

          <button
            type="submit"
            className="border px-10 py-2 rounded-lg bg-violet-950 border-violet-700 text-slate-400 font-semibold hover:bg-violet-500 hover:text-slate-900"
          >
            JOIN
          </button>
        </form>
        <NavLink
          className={"text-violet-500 hover:text-violet-800"}
          to={"/create"}
        >
          Create a Room
        </NavLink>
      </div>
    </div>
  );
}

export default JoinRoom;
