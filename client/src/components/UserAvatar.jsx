// 📁 components/UserAvatar.jsx
import React, { useMemo } from "react";

function UserAvatar({ user, isOnline = false, size = 48 }) {
  if (!user) return null;

  // Generate random but consistent color per user
  const avatarColor = useMemo(() => {
    const colors = [
      "bg-blue-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-rose-500",
      "bg-teal-500",
    ];
    const index =
      user._id?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  }, [user?._id]);

  // Create initials (First + Last)
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0]?.toUpperCase() || "";
    const last =
      parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() : "";
    return first + last;
  };

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      {user.profilePic ? (
        <div
          className="rounded-full overflow-hidden border-2 border-slate-700"
          style={{ width: size, height: size }}
        >
          <img
            src={user.profilePic}
            alt={user.fullName}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center font-semibold text-white rounded-full ${avatarColor}`}
          style={{
            width: size,
            height: size,
            fontSize: `${size / 2.5}px`,
          }}
        >
          {getInitials(user.fullName)}
        </div>
      )}

      {/* ✅ Online Indicator Dot */}
      <span
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
          isOnline ? "bg-green-500" : "bg-slate-500"
        }`}
      ></span>
    </div>
  );
}

export default UserAvatar;
