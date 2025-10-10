import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed w-full bg-slate-800/50 rounded-xl p-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab flex-1 font-medium rounded-lg transition-all duration-200 ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
            : "text-slate-400 hover:text-cyan-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 font-medium rounded-lg transition-all duration-200 ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
            : "text-slate-400 hover:text-cyan-400"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
