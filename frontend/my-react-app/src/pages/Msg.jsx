import React from 'react'
import {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';
export default function Msg() {
 const [messages, setMessages] = useState([]);
 const { state } = useLocation();
 const { friendId, userId } = state || {};

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`http://localhost:3003/messages/conversation/${userId}/${friendId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          alert(data.message || "Failed to fetch messages.");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [userId, friendId]);

   async function sendMessage(event) {
    event.preventDefault();
    const messageInput = event.target.querySelector('input[type="text"]');
    const message = messageInput.value;

    if (!message) {
      alert('Please type a message before sending.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/messages/${userId}/${friendId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ msg: message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, data]);
        messageInput.value = '';
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
        <form onSubmit={sendMessage} className="flex flex-col items-center">
            <input type="text" placeholder="Type your message..." className="border p-2 rounded w-full mb-2" />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Send
            </button>
        </form>
        {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded ${msg.senderId === userId ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
                {msg.msg}
            </div>
        ))}
    </div>
  )
}
