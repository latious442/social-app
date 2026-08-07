import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export default function Msg() {
  const [messages, setMessages] = useState([]);
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  const { state } = useLocation();
  const { friendId, userId } = state || {};

  const socket = useRef(null);

  // Connect to Socket.IO
  useEffect(() => {
    if (!userId) return;

    socket.current = io("http://localhost:3003", {
      withCredentials: true,
    });

    socket.current.emit("join", { userId });

    socket.current.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [userId]);

  // Fetch previous messages
  useEffect(() => {
    async function fetchMessages() {
      if (!userId || !friendId) return;

      try {
        const response = await fetch(
          `http://localhost:3003/messages/conversation/${userId}/${friendId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          alert(data.message || "Failed to fetch messages.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();
  }, [userId, friendId]);

  // Send text message
  async function sendMessage(event) {
    event.preventDefault();

    const messageInput = event.target.querySelector(
      'input[type="text"]'
    );

    const message = messageInput.value.trim();

    if (!message) {
      alert("Please type a message before sending.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3003/messages/${userId}/${friendId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msg: message,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Add message locally
        setMessages((prevMessages) => [...prevMessages, data]);

        // Notify the other user
        socket.current?.emit("sendMessage", {
          senderId: userId,
          receiverId: friendId,
          msg: message,
        });

        messageInput.value = "";
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // Send photo
  async function sendPhoto(event) {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a photo.");
      return;
    }

    // Photo upload logic will go here
    console.log("Selected photo:", file);

    setShowPhotoForm(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">

        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet.
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-1 rounded-xl w-fit max-w-[70%] ${
                msg.senderId === userId
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <div>{msg.msg}</div>

              <div className="text-xs text-gray-500 mt-1">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleString()
                  : ""}
              </div>
            </div>
          ))
        )}

      </div>

      {/* ================= MESSAGE INPUT ================= */}
      <div className="p-4 bg-white border-t">

        <div className="flex items-center gap-2">

          {/* Message form */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 flex-1"
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-5 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>

          {/* + button OUTSIDE the form */}
          <button
            type="button"
            onClick={() => setShowPhotoForm(true)}
            className="bg-blue-500 text-white text-xl w-11 h-11 rounded-lg hover:bg-blue-600"
          >
            +
          </button>

        </div>

      </div>

      {/* ================= PHOTO MODAL ================= */}
      {showPhotoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          {/* Modal box */}
          <div
            id="pht"
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
          >

            {/* Modal header */}
            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold text-gray-800">
                Send a Photo
              </h2>

              <button
                type="button"
                onClick={() => setShowPhotoForm(false)}
                className="text-gray-400 hover:text-red-500 text-3xl leading-none"
              >
                ×
              </button>

            </div>

            {/* Photo form */}
            <form onSubmit={sendPhoto}>

              <input
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg p-3 mb-5"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setShowPhotoForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Send
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}