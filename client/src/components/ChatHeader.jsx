import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import UserAvatar from "./UserAvatar"; // ✅ imported new component

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, typingUsers, lastSeenMap, setLastSeenMap } =
    useAuthStore();

  const [fetchedLastSeen, setFetchedLastSeen] = useState(null);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isTyping = typingUsers[selectedUser._id];
  const lastSeen = lastSeenMap[selectedUser._id] || fetchedLastSeen;

  // Escape key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  // Fetch last seen
  useEffect(() => {
    const fetchLastSeen = async () => {
      try {
        const res = await axios.get(`/api/users/${selectedUser._id}`, {
          withCredentials: true,
        });
        if (res.data?.lastSeen) {
          setFetchedLastSeen(res.data.lastSeen);
          setLastSeenMap((prev) => ({
            ...prev,
            [selectedUser._id]: res.data.lastSeen,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch lastSeen:", error);
      }
    };

    if (selectedUser) fetchLastSeen();
  }, [selectedUser, setLastSeenMap]);

  const formatLastSeen = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `Last seen at ${date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })}`;
  };

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3 relative">
        {/* ✅ Reusable Avatar Component */}
        <UserAvatar user={selectedUser} isOnline={isOnline} size={48} />

        <div>
          <h3 className="text-slate-200 font-medium text-[17px]">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm">
            {isTyping
              ? "Typing..."
              : isOnline
              ? "Online"
              : formatLastSeen(lastSeen)}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
