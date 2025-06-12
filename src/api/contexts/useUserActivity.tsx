import { useEffect, useRef } from "react";
import { useSocket } from "./socketContext";

const useUserActivity = () => {
  const socket = useSocket();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const idleTime = 60 * 1000; // 1 นาที

  const setAway = () => {
    if (socket && parsedUser?._id) {
      socket.emit("user-away", parsedUser._id);
    }
  };

  const setActive = () => {
    if (socket && parsedUser?._id) {
      socket.emit("user-active", parsedUser._id);
    }
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive();
    timeoutRef.current = setTimeout(setAway, idleTime);
  };

  useEffect(() => {
    if (!socket || !parsedUser?._id) return;

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [socket, parsedUser?._id]);
};

export default useUserActivity;
