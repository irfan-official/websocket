import React, { useState, useEffect, useRef } from "react";
import {
  editMessage,
  findClickStatus,
  findRoomName,
  formatTime,
  isNewerMessage,
} from "../../utils/RoomCard.utils.js";

function RoomCard({
  socket,
  click,
  userID,
  setClick,
  roomType,
  roomName,
  roomPhoto,
  roomTitle,
  timeStamps,
  unseenMessage,
  roomLastSeenMap,
  setRoomLastSeenMap,
}) {
  const [latestMessage, setLatestMessage] = useState(unseenMessage);
  const [latestMessageSender, setLatestMessageSender] = useState(unseenMessage);
  const [displayCurrentMessageTime, setDisplayCurrentMessageTime] =
    useState(timeStamps);
  const [messageStatus, setMessageStatus] = useState("OLD");
  const [newMessageStatus, setNewMessageStatus] = useState(false);

  const isNewer = isNewerMessage(
    click,
    roomName,
    roomLastSeenMap,
    displayCurrentMessageTime,
    userID, // NEW PARAM!
    latestMessageSender
  );

  useEffect(() => {
    socket.on("latestMessage", (data) => {
      if (data.roomName === roomName) {
        setLatestMessageSender(data.userID);
        setLatestMessage(data.message);
        setDisplayCurrentMessageTime(data.time);
        setMessageStatus((prev) => (prev != "NEW" ? "NEW" : prev));
      }
    });
    socket.on("unseenMessage", (data) => {
      setNewMessageStatus((prev) => ({ ...prev, status: data.status }));
    });
  }, []);

  return (
    <div
      onClick={() => {
        const previosRoomName = click.roomName;
        setNewMessageStatus((prev) => ({ ...prev, status: !prev.status }));
        setClick((prevData) => ({
          clickStatus: findClickStatus(prevData, roomName),
          roomType: roomType,
          roomName: findRoomName(prevData, roomName),
          roomPhoto: roomPhoto,
          roomTitle: roomTitle,
        }));
        setRoomLastSeenMap((prev) => ({
          ...prev,
          [roomName]: Date.now(),
          [previosRoomName]: Date.now(),
        }));
      }}
      draggable="true"
      className="w-full h-20 bg-slate-900 border-b-2 border-b-slate-500 flex rounded-lg overflow-hidden container"
    >
      <div className="space_div w-[8px] h-full flex items-center ml-1.5">
        <div className="w-full h-[35%] bg-lime-500 rounded-full"></div>
      </div>
      <div className="room_photo pl-1.5 w-[97px] h-full flex items-center justify-center relative">
        <div className="room_metadata w-[57px] h-[57px] bg-black rounded-full overflow-clip">
          <img className="object-contain" src={roomPhoto} alt="image" />
        </div>
      </div>
      <div className="room_info h-full w-[75%]">
        <div className="top_ w-full h-[54%] b flex items-center">
          <div className="name h-full w-[75%] px-2 py-2">
            <h1 className="text-[18px]">{roomTitle}</h1>
          </div>
          <div
            className={`time flex items-center w-[25%] h-[90%] justify-center ${
              messageStatus != "OLD"
                ? isNewer
                  ? "text-orange-500 font-semibold"
                  : ""
                : ""
            }`}
          >
            <h6 className="text-[0.7rem]">
              {formatTime(displayCurrentMessageTime)}
            </h6>
          </div>
        </div>
        <div className="bottom_ w-full h-[40%] flex items-center justify-start pl-2.5">
          <h5
            className={`text-[0.7rem] ${
              messageStatus != "OLD"
                ? isNewer
                  ? "text-orange-500 font-semibold"
                  : "text-white font-normal"
                : ""
            }`}
          >
            {editMessage(latestMessage)}
          </h5>
        </div>
      </div>
      <div className="w-[px] h-full  flex items-start m-[6px]">
        <div className="w-[7px] h-[7px] rounded-full bg-orange-500"></div>
      </div>
    </div>
  );
}

export default RoomCard;
