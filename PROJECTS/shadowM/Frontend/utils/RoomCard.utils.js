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
  return prevData.roomName === roomName ? prevData.roomName : roomName;
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
export function isNewerMessage(
  click,
  roomName,
  roomLastSeenMap,
  displayCurrentMessageTime,
  userID,
  latestMessageSender
) {
  try {
    if (userID === latestMessageSender) {
      return false;
    }
    if (click.roomName != roomName) {
      const lastSeenTime = roomLastSeenMap[roomName] || 0;
      const messageTime = new Date(displayCurrentMessageTime).getTime();
      return lastSeenTime < messageTime;
    }
    return false;
  } catch {
    return false;
  }
}
