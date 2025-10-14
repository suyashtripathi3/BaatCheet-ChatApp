import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore";
import UserAvatar from "./UserAvatar";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
    selectedUser,
  } = useChatStore(); // ✅ added selectedUser
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-2">
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id; // ✅ check selected

        return (
          <div
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-slate-700/30 transition-colors
              ${
                isSelected
                  ? "bg-cyan-500/30 hover:bg-cyan-500/40" // selected highlight
                  : "bg-slate-800/40 hover:bg-slate-700/40"
              } // normal hover
            `}
          >
            {/* ✅ UserAvatar */}
            <UserAvatar user={contact} isOnline={isOnline} size={48} />

            <div className="flex-1 min-w-0">
              <h4 className="text-slate-200 font-medium truncate">
                {contact.fullName}
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

export default ContactList;
