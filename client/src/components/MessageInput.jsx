import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import useKeyboardSound from "../hooks/useKeyboardSound.js";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, SmileIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageBeingEdited, setMessageBeingEdited] = useState(null);

  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const { sendMessage, updateMessage, isSoundEnabled, selectedUser } =
    useChatStore();
  const { socket } = useAuthStore();

  // Typing logic
  const handleTyping = (e) => {
    setText(e.target.value);
    if (isSoundEnabled) playRandomKeyStrokeSound();

    if (socket && selectedUser) {
      socket.emit("typing", selectedUser._id);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", selectedUser._id);
      }, 1500);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Final handleSend function
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    const oldText = text;

    // Clear input immediately for better UX
    setText("");
    removeImage();
    setShowEmojiPicker(false);

    try {
      if (image) setIsUploading(true);

      if (messageBeingEdited) {
        await updateMessage(messageBeingEdited._id, formData);
        setMessageBeingEdited(null);
      } else {
        await sendMessage(formData);
      }
    } catch (error) {
      setText(oldText);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
      if (socket && selectedUser) {
        socket.emit("stopTyping", selectedUser._id);
      }
    }
  };

  // Populate input when editing
  const startEditingMessage = (message) => {
    setMessageBeingEdited(message);
    setText(message.text || "");
    setImagePreview(message.image || null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  return (
    <div className="p-3 sm:p-4 border-t border-slate-700/50 relative bg-slate-900/50 backdrop-blur-md">
      {/* ✅ Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-20 sm:bottom-16 left-2 sm:left-4 z-50"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      {/* ✅ Image Preview */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center justify-start">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Message Input */}
      <form
        onSubmit={handleSend}
        className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3 px-2 sm:px-0"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 active:scale-90 transition"
        >
          <SmileIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <label
          htmlFor="imageUpload"
          className={`cursor-pointer p-2 rounded-lg ${
            imagePreview
              ? "text-cyan-500"
              : "text-slate-400 hover:text-slate-200"
          } active:scale-90 transition`}
        >
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </label>

        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder={
            messageBeingEdited ? "Editing message..." : "Type your message..."
          }
          className="flex-1 w-full bg-slate-800/60 border border-slate-700/50 rounded-lg py-2 px-3 text-slate-200 placeholder-slate-400 outline-none text-sm sm:text-base focus:ring-1 focus:ring-cyan-500 transition"
          disabled={isUploading}
        />
        <button
          type="submit"
          disabled={(!text.trim() && !image) || isUploading}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-3 sm:px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
