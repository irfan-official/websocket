export function Roomfinder(userHistory, click) {
  return (
    userHistory.rooms?.find((objData) => click.roomName === objData.roomName) ||
    {}
  );
}

export function RoomTitleFinder(data, userData) {
  return Array.isArray(data.roomTitle)
    ? data.roomTitle.filter((title) => title !== userData.userName).join(", ")
    : data.roomTitle || "";
}

export function RoomPhotoFinder(data, userData) {
  return data.roomPhoto.length > 1
    ? data.roomPhoto.find((imgObj) => imgObj.userID !== userData.userID)?.image
    : data.roomPhoto[0]?.image || "";
}

export function TimeFinder(data) {
  return (
    new Date(data?.messages[data?.messages.length - 1]?.createdAt) ||
    data.createdAt
  );
}

export function UnseenMessageFinder(data) {
  return data?.messages[data?.messages.length - 1]?.message || "";
}

export const startDragging = (
  e,
  isDragging,
  startX,
  startWidth,
  setSidebarWidth
) => {
  isDragging.current = true;
  startX.current = e.clientX;
  startWidth.current = parseInt(
    getComputedStyle(document.querySelector("#resizableSidebar")).width
  );

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.min(Math.max(startWidth.current + deltaX, 300), 500);
    setSidebarWidth(newWidth);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
