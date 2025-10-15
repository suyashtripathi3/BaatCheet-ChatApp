import { useState, useRef, useEffect } from "react";
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  CameraIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UserAvatar from "./UserAvatar";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef();

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Upload new profile photo
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instantly close dropdown before upload starts
    setIsDropdownOpen(false);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setIsUploading(true);
      try {
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      } finally {
        setIsUploading(false);
      }
    };
  };

  // ✅ Remove profile photo
  const handleRemovePhoto = async () => {
    // Instantly close dropdown before removing
    setIsDropdownOpen(false);

    setIsUploading(true);
    try {
      await updateProfile({ profilePic: null });
      setSelectedImg(null);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Check if user has a photo
  const hasPhoto =
    (authUser?.profilePic && authUser.profilePic.trim() !== "") ||
    (selectedImg && selectedImg.trim() !== "");

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* ✅ Profile Picture with Hover Overlay */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            disabled={isUploading}
            className={`relative group cursor-pointer rounded-full transition-transform duration-200 ${
              isUploading
                ? "opacity-60 pointer-events-none"
                : "hover:scale-[1.02]"
            }`}
            style={{ width: "56px", height: "56px" }}
          >
            <div className="relative w-14 h-14 rounded-full">
              <UserAvatar
                user={{
                  ...authUser,
                  profilePic: selectedImg || authUser.profilePic,
                }}
                isOnline={true}
                size={56}
              />

              {/* ✅ Centered camera overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 rounded-full">
                <CameraIcon className="text-white w-5 h-5" />
              </div>
            </div>
          </button>

          {/* ✅ Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-14 left-0 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 w-44 overflow-hidden animate-fade-in">
              {!hasPhoto ? (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                >
                  <CameraIcon className="w-4 h-4" /> Upload Photo
                </button>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <CameraIcon className="w-4 h-4" /> Upload New
                  </button>
                  <button
                    onClick={handleRemovePhoto}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Trash2Icon className="w-4 h-4" /> Remove Photo
                  </button>
                </>
              )}
            </div>
          )}

          {/* Hidden Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* USER DETAILS */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* Logout */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="w-5 h-5" />
          </button>

          {/* Sound toggle */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-5 h-5" />
            ) : (
              <VolumeOffIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
