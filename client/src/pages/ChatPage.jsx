import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

function ChatPage() {
  const { logout } = useAuthStore();

  return (
    <div className="z-10">
      ChatPage
      <button  onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default ChatPage;
