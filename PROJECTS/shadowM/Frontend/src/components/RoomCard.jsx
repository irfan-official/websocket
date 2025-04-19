import React, { useState, useEffect } from "react";

function RoomCard({
  socket,
  click,
  setClick,
  roomType,
  roomName,
  roomPhoto,
  roomTitle,
  timeStamps,
  unseenMessage,
  roomCardCreationTime,
}) {
  function editMessage(message) {
    let str = "";
    if (message.length > 23) {
      let count = 0;
      for (let c of message) {
        str += c;
        if (count === 25) {
          str += "...";
          return str;
        }
        count++;
      }
    }
    return message;
  }

  const [TimeOptions] = useState({
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  function findClickStatus(prevData) {
    return prevData.roomName === roomName ? !prevData.clickStatus : true;
  }

  function findRoomName(prevData) {
    return prevData.roomName === roomName ? !prevData.roomName : roomName;
  }

  const [latestMessage, setLatestMessage] = useState(unseenMessage);
  const [displayCurrentMessageTime, setDisplayCurrentMessageTime] =
    useState(timeStamps);

  useEffect(() => {
    socket.on("latestMessage", (data) => {
      if (data.roomName === roomName) {
        setLatestMessage(data.message);
        setDisplayCurrentMessageTime(data.time);
      }
    });
  }, []);

  // ✅ Safely format time for display
  function formatTime(dateValue) {
    try {
      return new Date(dateValue).toLocaleString("en-US", TimeOptions);
    } catch {
      return "";
    }
  }

  // ✅ Safely compare timestamps
  function isNewerMessage(creationTime, messageTime) {
    try {
      if (roomName !== click.roomName) {
        return (
          new Date(creationTime).getTime() < new Date(messageTime).getTime()
        );
      }
      return false;
    } catch {
      return false;
    }
  }

  const isNewer = isNewerMessage(
    roomCardCreationTime,
    displayCurrentMessageTime
  );

  return (
    <div
      onClick={() =>
        setClick((prevData) => ({
          clickStatus: findClickStatus(prevData),
          roomType: roomType,
          roomName: findRoomName(prevData),
          roomPhoto: roomPhoto,
          roomTitle: roomTitle,
        }))
      }
      draggable="true"
      className="w-full h-20 bg-slate-900 border-b-2 border-b-slate-500 flex rounded-lg overflow-hidden container"
    >
      <div className="space_div w-[8px] h-full flex items-center ml-1.5">
        <div className="w-full h-[10%] bg-lime-500 rounded-full"></div>
      </div>
      <div className="room_photo pl-1.5 w-[97px] h-full flex items-center justify-center relative">
        <div className="room_metadata w-[57px] h-[57px] bg-black rounded-full overflow-clip">
          <img className="object-contain" src={roomPhoto} alt="image" />
        </div>
      </div>
      <div className="room_info h-full w-[75%]">
        <div className="top_ w-full h-[54%] b flex">
          <div className="name h-full w-[75%] px-2 py-2">
            <h1 className="text-[1.3rem]">{roomTitle}</h1>
          </div>
          <div
            className={`time flex items-center w-[25%] h-[90%] justify-center ${
              isNewer ? "font-bold" : ""
            }`}
          >
            <h6 className="text-[0.7rem]">
              {formatTime(displayCurrentMessageTime)}
            </h6>
          </div>
        </div>
        <div className="bottom_ w-full h-[40%] flex items-center justify-start pl-2.5">
          <h5
            className={` ${
              isNewer
                ? "text-white font-bold text-[0.8rem]"
                : "text-white font-normal text-[0.7rem]"
            }`}
          >
            {editMessage(latestMessage)}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
