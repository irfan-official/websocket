import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
function Home({ userEmail, img }) {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );
  let [scrollBehave, setScrollBehave] = useState("auto");

  let [clientMessage, setClientMessage] = useState("");

  let [allMessages, setAllMessages] = useState([
    // { c: "client message 1" },
    // { s: "server message 1" },
  ]);

  //let behave = "smooth"
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.emit("register", {
      socketID: socket.id,
      email: userEmail,
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: scrollBehave,
    });
  }, [allMessages]);

  useEffect(() => {
    socket.on("reply", (data) => {
      console.log("Reply from server:", data);
      setAllMessages((messages) => [...messages, { s: data }]);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!clientMessage) return;
    if (clientMessage.length <= 200) {
      let obj = {
        message: clientMessage,
      };
      //console.log(obj);

      setScrollBehave("smooth");
      socket.emit("message", clientMessage);
      setAllMessages((prev) => [...prev, { c: clientMessage }]);
      setClientMessage("");
    } else {
      return;
    }
  }

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex p-4 items-center justify-center">
      <div className="w-4/12 h-[calc(100vh-12rem)] border rounded-lg overflow-hidden flex flex-col items-center justify-end gap-1">
        <div
          ref={scrollRef}
          className="w-full h-[calc(100%-3.7rem)] overflow-y-auto px-1 py-1 flex flex-col gap-1"
        >
          <div className="mt-auto">
            {allMessages.map((msg, idx) => {
              // checkscrollBehave(idx);
              return (
                <div
                  key={idx}
                  className={`w-full min-h-[3rem] px-1 py-1 flex relative ${
                    msg.c ? "justify-start" : "justify-end"
                  } flex-wrap overflow-hidden`}
                >
                  <p
                    className={`${
                      msg.c ? "bg-blue-600" : "bg-violet-600"
                    } px-2  py-2 rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-sm inline-flex flex-wrap text-pretty items-center mb-1`}
                  >
                    {msg.c || msg.s}
                  </p>
                  {msg.s ? (
                    <img
                      className="w-[15px] object-cover rounded-full absolute right-0 bottom-0 z-50"
                      src={`${img}`}
                      alt=""
                    />
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
            {/* {clientMessage ? <span>...</span> : ""} */}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full px-2 py-2 bottom-0 bg-slate-600 flex gap-1 items-center justify-center text-black"
        >
          <input
            onChange={(e) => {
              socket.emit("typeing");
              setClientMessage(e.target.value);
            }}
            value={clientMessage}
            className="w-10/12 px-2 py-2 rounded-lg bg-slate-950 border-2 border-slate-500 text-white"
            type="text"
            placeholder="message"
          />
          <button
            onClick={() => {
              setClientMessage((prev) => {
                let msg = prev.trim();
                if (msg.length > 200) {
                  alert("you can not write message more than 200 words");
                }
                if (msg.length > 25) {
                  let str = "";
                  let lengthCount = 0;
                  for (let c of msg) {
                    ++lengthCount;
                    str += c;
                    if (lengthCount === 25) {
                      str += "\n";
                      lengthCount = 0;
                    }
                  }
                  msg = str;
                }
                return msg;
              });
            }}
            type="submit"
            className="w-2/12 text-center px-2 py-2 rounded-lg bg-black text-white border-2 border-slate-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
