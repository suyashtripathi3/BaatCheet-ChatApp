import React from "react";
import BorderAnimatedContainer from "../components/BoderAnimatedContainer.jsx";
import { useChatStore } from "../store/useChatStore.js";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ChatList from "../components/ChatList.jsx";
import ContactList from "../components/ContactList.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoConersationPlaceholder from "../components/NoConersationPlaceholder.jsx";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="relative w-full h-screen sm:h-[550px] sm:w-[90%] max-w-6xl mx-auto px-2 sm:px-4 overflow-hidden">
      <BorderAnimatedContainer>
        {/* Responsive Layout */}
        <div className="flex flex-1 h-full w-full overflow-hidden">
          {/* LEFT PANEL */}
          <div
            className={`bg-slate-800/50 backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out
              ${
                selectedUser ? "hidden md:flex md:w-80" : "flex w-full md:w-80"
              }`}
          >
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              {activeTab === "chats" ? <ChatList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className={`flex-1 flex flex-col bg-slate-900/60 backdrop-blur-md transition-all duration-300 ease-in-out
              ${selectedUser ? "flex" : "hidden md:flex"}`}
          >
            {selectedUser ? (
              <>
                {/* Back button for mobile */}
                <div className="md:hidden p-2">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                </div>
                <ChatContainer />
              </>
            ) : (
              <NoConersationPlaceholder />
            )}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
