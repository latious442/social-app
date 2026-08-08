
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export default function Msg() {
  const [messages, setMessages] = useState([]);
  const [showPhotoForm, setShowPhotoForm] = useState(false);

  const { state } = useLocation();
  const { friendId, userId } = state || {};

  //  Socket.IO connection
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

 
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
      socket.current = null;
    };
  }, [userId]);


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

  // =========================
  // SEND TEXT MESSAGE
  // =========================
  async function sendMessage(event) {
    event.preventDefault();

    const messageInput = event.target.querySelector(
      'input[type="text"]'
    );

    const message = messageInput.value.trim();

    if (!message) {
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
        // Add message immediately to UI
        setMessages((prevMessages) => [
          ...prevMessages,
          data,
        ]);

        // Notify receiver
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

  // =========================
  // SEND PHOTO
  // =========================
  async function sendPhoto(event) {
    event.preventDefault();

    const fileInput = event.target.querySelector(
      'input[type="file"]'
    );

    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:3003/messages/${userId}/${friendId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, data]);

        socket.current?.emit("sendMessage", data);

        setShowPhotoForm(false);
      } else {
        alert(data.message || "Failed to send photo.");
      }
    } catch (error) {
      console.error("Error sending photo:", error);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">

     
      <div className="flex-1 min-h-0 overflow-y-auto p-4 h-50">

        <div className="flex flex-col gap-2">

          {messages.length === 0 ? (
            <div className="text-center text-muted mt-10">
              No messages yet.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl w-fit max-w-[70%] ${
                  msg.senderId === userId
                    ? "bg-accent text-paper self-end"
                    : "bg-paper border border-line self-start"
                }`}
              >
                {msg.pht && (
                  <img
                    src={msg.pht}
                    alt="photo"
                    className="rounded-lg max-w-full max-h-60 object-cover"
                  />
                )}

                {msg.msg && <div>{msg.msg}</div>}

                <div className={`text-xs mt-1 ${msg.senderId === userId ? "text-paper/70" : "text-muted"}`}>
                  {msg.createdAt
                    ? new Date(
                        msg.createdAt
                      ).toLocaleString()
                    : ""}
                </div>
              </div>
            ))
          )}

        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* ==================================
          MESSAGE INPUT
          DOES NOT SCROLL
      =================================== */}
      <div className="flex-shrink-0 bg-paper border-t border-line p-4">

        <div className="flex items-center gap-2">

          {/* Message form */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 flex-1"
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="border border-line p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink"
            />

            <button
              type="submit"
              className="bg-ink text-cream py-2 px-5 rounded-lg hover:opacity-90"
            >
              Send
            </button>
          </form>

          {/* Photo button */}
          <button
            type="button"
            onClick={() => setShowPhotoForm(true)}
            className="bg-accent text-paper text-xl w-11 h-11 rounded-lg hover:bg-accent-dark"
          >
            +
          </button>

        </div>
      </div>

    
      {showPhotoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-paper rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">

            {/* Modal header */}
            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold text-ink">
                Send a Photo
              </h2>

              <button
                type="button"
                onClick={() => setShowPhotoForm(false)}
                className="text-muted hover:text-[#b5655d] text-3xl leading-none"
              >
                ×
              </button>

            </div>

            {/* Photo form */}
            <form onSubmit={sendPhoto}>

              <input
                type="file"
                accept="image/*"
                className="w-full border border-line rounded-lg p-3 mb-5 bg-white"
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setShowPhotoForm(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-cream hover:opacity-90"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent text-paper hover:bg-accent-dark"
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
