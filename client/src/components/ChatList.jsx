import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore.js";
import UserAvatar from "./UserAvatar";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore(); // ✅ get selectedUser
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isSelected = selectedUser?._id === chat._id; // ✅ check selected

        return (
          <div
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-slate-700/30 transition-colors
              ${
                isSelected
                  ? "bg-cyan-500/30 hover:bg-cyan-500/40" // selected highlight
                  : "bg-slate-800/40 hover:bg-slate-700/40"
              } // normal hover
            `}
          >
            {/* ✅ Reusable Avatar */}
            <UserAvatar user={chat} isOnline={isOnline} size={48} />

            <div className="flex-1 min-w-0">
              <h4 className="text-slate-200 font-medium truncate">
                {chat.fullName}
              </h4>
              <p
                className={`text-xs ${
                  isOnline ? "text-green-400" : "text-slate-400"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;