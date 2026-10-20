"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string; // Mapped from backend "message"
  message?: string; // Backend field name
  sender: "me" | "other" | string;
  timestamp: number;
  createdAt?: string;
  name?: string;
} 

import { useAuth } from "@/lib/simple-backend-auth";

export default function ChatWidget() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Display name for this session (registered user or Guest)
  const displayName = user?.name || user?.email || (typeof window !== 'undefined' && localStorage.getItem('chat_room_id')?.startsWith('guest_') ? 'Guest' : 'User');

  // 1. Determine Room ID based on User Auth
  // 1. Determine Room ID based on User Auth
  useEffect(() => {
    if (loading) return; // Wait until we know if user is logged in

    const storedRoomId = localStorage.getItem("chat_room_id");

    if (user?.id) {
      // Logic: If user is logged in, their Room ID MUST be their User ID
      // We force this update even if a guest ID exists
      if (storedRoomId !== user.id) {
        // If we had a guest ID, we could theoretically merge history here, 
        // but for now, we switch to the User ID to ensure profile name shows up.
        localStorage.setItem("chat_room_id", user.id);
        setRoomId(user.id);
      } else {
        setRoomId(user.id);
      }
    } else {
      // Logic: If user is NOT logged in (guest)
      // Check if we already have a valid guest ID
      if (!storedRoomId || !storedRoomId.startsWith("guest_")) {
        // Generate new guest ID if none exists or if the stored one was a user ID (from previous session)
        const newGuestId = "guest_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("chat_room_id", newGuestId);
        setRoomId(newGuestId);
      } else {
        setRoomId(storedRoomId);
      }
    }
  }, [user, loading]);

  // 2. Connect to Socket when Room ID is ready
  useEffect(() => {
    if (!roomId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const formatMessage = (msg: any): Message => {
      const isMe = msg.sender === "user";
      return {
        id: msg.id || Date.now().toString(),
        text: msg.message || msg.text || "",
        sender: isMe ? "me" : "other",
        timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
        name: msg.name ?? (msg.sender === "admin" ? "Admin" : (isMe ? displayName : "Guest")),
      };
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${socketUrl}/api/chats/${encodeURIComponent(roomId)}`);
        if (!res.ok) return;
        const history = await res.json();
        if (Array.isArray(history)) {
          setMessages(history.map(formatMessage));
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    setSocketConnected(false);
    fetchHistory();

    const newSocket = io(socketUrl);

    newSocket.on("connect", () => {
      console.log("Connected to chat server with Room ID:", roomId);
      setSocketConnected(true);
      // Join the room
      newSocket.emit("join", roomId);
    });

    newSocket.on("disconnect", () => {
      setSocketConnected(false);
    });

    newSocket.on("history", (history: unknown) => {
      console.log("Received history:", history);
      if (!Array.isArray(history)) {
        console.warn("History is not an array:", history);
        return;
      }
      const formattedHistory = history.map(formatMessage);
      setMessages(formattedHistory);
    });

    newSocket.on("message", (msg: any) => {
      setMessages((prev) => [
        ...prev,
        formatMessage(msg),
      ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text || !socket || !roomId) return;

    const messagePayload = {
      text,
      roomId: roomId,
      sender: "user",
      name: displayName, // Send the computed display name (user name or 'Guest')
    };

    socket.emit("message", messagePayload);
    setMessages((prev) => [
      ...prev,
      {
        id: `pending-${Date.now()}`,
        text,
        sender: "me",
        timestamp: Date.now(),
        name: displayName,
      },
    ]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const otherName = messages.find((m) => m.sender !== 'me' && m.name)?.name;
  const chatting = messages.some((m) => m.sender !== 'me') ? `Chatting with ${otherName ?? 'Admin'}` : 'Start a conversation';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-sm font-medium">Live Chat</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {messages.find((m) => m.sender !== 'me' && m.name)?.name ?? displayName}
                  </span>
                  <div className="text-[11px] text-gray-500" title={chatting} aria-label={chatting}>
                    {chatting}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div className="flex flex-col">
                      {msg.sender !== "me" && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">
                          {msg.name ?? (msg.sender === 'other' ? 'Admin' : 'Guest')}
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t gap-2">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button size="icon" onClick={sendMessage} disabled={!inputValue.trim() || !roomId}>
              <Send className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
