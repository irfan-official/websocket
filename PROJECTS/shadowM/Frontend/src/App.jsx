import React, { useRef, useState, useEffect, useMemo } from "react";
import RoomCard from "./components/RoomCard";
import RoomMessage from "./components/RoomMessage";
// import { addUserData, getAllUserData } from "../utils/db.js";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import {
  Roomfinder,
  RoomTitleFinder,
  RoomPhotoFinder,
  TimeFinder,
  UnseenMessageFinder,
  startDragging,
} from "../utils/App.utils.js";

function App() {
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

  let [userHistory, setUserHistory] = useState(null);

  let [click, setClick] = useState({
    clickStatus: false,
    roomType: "",
    roomName: "",
    roomPhoto: "",
    roomTitle: "",
  });

  const [roomLastSeenMap, setRoomLastSeenMap] = useState({});

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("error", async (data) => {
      alert(data.message);
      return Navigate("/login");
    });
  }, []);

  useEffect(() => {
    socket.emit("register", {
      userID: userData.userID,
    });
  }, []);

  useEffect(() => {
    socket.on("allData", async (data) => {
      setUserHistory({
        ...data,
        rooms: data.rooms || [],
      });
    });
  }, []);

  return (
    <div className="w-full h-screen bg-gray-600 text-white flex flex-col">
      <header className="w-full h-14 bg-slate-950 flex items-center px-4">
        <h1 className="text-xl font-bold">Chat App</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-20 min-w-[60px] bg-slate-950"></aside>

        <aside
          id="resizableSidebar"
          className={`h-full bg-slate-700 rounded-lg flex flex-col border-r-2 border-t-2 border-slate-600 ${
            isDragging.current ? "" : "transition-all duration-200 ease-in-out"
          }`}
          style={{ width: sidebarWidth }}
        >
          <div className="w-full h-20 bg-slate-700 p-4 flex items-center">
            <h2 className="text-lg font-semibold">Rooms</h2>
          </div>
          <div className="w-full h-16 bg-slate-800 p-4 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-950 text-white p-2 rounded"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 p-2 overflow-auto pt-4">
            {Array.isArray(userHistory?.rooms) &&
            userHistory.rooms.length > 0 ? (
              userHistory.rooms.map((data, index) => {
                return (
                  <RoomCard
                    key={index}
                    setClick={setClick}
                    roomType={data.roomType}
                    roomName={data.roomName}
                    socket={socket}
                    click={click}
                    userID={userData.userID}
                    roomLastSeenMap={roomLastSeenMap}
                    setRoomLastSeenMap={setRoomLastSeenMap}
                    roomPhoto={RoomPhotoFinder(data, userData)}
                    roomTitle={RoomTitleFinder(data, userData)}
                    timeStamps={TimeFinder(data)}
                    unseenMessage={UnseenMessageFinder(data)}
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-300 mt-4">
                You have no rooms yet.
              </p>
            )}
          </div>
        </aside>

        <div
          onMouseDown={(e) =>
            startDragging(e, isDragging, startX, startWidth, setSidebarWidth)
          }
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#94a3b8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#64748b")}
          style={{
            width: "4px",
            backgroundColor: "#64748b",
            cursor: "ew-resize",
            zIndex: 10,
            height: "100%",
            flexShrink: 0,
          }}
        />

        <section className="flex-1 h-full bg-gray-600 p-4">
          {click.clickStatus ? (
            <RoomMessage
              userID={userData.userID}
              socket={socket}
              click={click}
              messages={Roomfinder(userHistory, click).messages}
              roomType={click.roomType}
              roomName={click.roomName}
              roomPhoto={click.roomPhoto}
              roomTitle={click.roomTitle}
              setRoomLastSeenMap={setRoomLastSeenMap}
            />
          ) : (
            <h1>welcome user</h1>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
