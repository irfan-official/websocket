import React from "react";

function RoomCard({
  setClick,
  roomType,
  roomName,
  roomPhoto,
  roomTitle,
  timeStamps,
  unseenMessage,
}) {
  return (
    <div
      onClick={() =>
        setClick((prevData) => ({
          clickStatus: !prevData.clickStatus,
          roomType: roomType,
          roomName: roomName,
          roomPhoto: roomPhoto,
          roomTitle: roomTitle,
        }))
      }
      draggable="true"
      className=" w-full h-24 bg-slate-900 border-b-2 border-b-slate-500 flex rounded-lg overflow-hidden container"
    >
      <div className="space_div w-[10px]"></div>
      <div
        className={`room_photo pl-3.5 w-[97px] h-full border-l-[7px] border-l-lime-400 flex items-center justify-center relative`}
      >
        <div className="room_metadata w-[65px] h-[65px] bg-black rounded-full overflow-clip">
          <img className="object-contain" src={roomPhoto} alt="image" />
        </div>
      </div>
      <div className="room_info h-full w-[75%] ">
        <div className="top_  w-full h-[45%] b flex">
          <div className="name  h-full w-[75%] px-4 py-3">
            <h1 className="text-[1.3rem]">{roomTitle}</h1>
          </div>
          <div className="time flex items-center w-[25%] h-[90%] justify-center">
            <h6>{timeStamps}</h6>
          </div>
        </div>
        <div className="bottom_ w-full h-[40%]  flex items-center justify-start pl-3.5">
          <h5 className="text-[1.1rem] font-semibold">{unseenMessage}</h5>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
