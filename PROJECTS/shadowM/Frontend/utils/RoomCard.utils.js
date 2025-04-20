export function editMessage(message) {
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

export function findClickStatus(prevData, roomName) {
  return prevData.roomName === roomName ? !prevData.clickStatus : true;
}

export function findRoomName(prevData, roomName) {
  return prevData.roomName === roomName ? !prevData.roomName : roomName;
}

export function formatTime(dateValue) {
  try {
    const TimeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateValue).toLocaleString("en-US", TimeOptions);
  } catch {
    return "";
  }
}

export function isNewerMessage(click, roomName, creationTime, messageTime) {
  try {
    if (roomName !== click.roomName) {
      return new Date(creationTime).getTime() < new Date(messageTime).getTime();
    }
    return false;
  } catch {
    return false;
  }
}
