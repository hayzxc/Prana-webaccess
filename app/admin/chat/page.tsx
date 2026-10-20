"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, MessageSquare } from "lucide-react";

interface Conversation {
    id: string;
    lastMessage: string;
    lastActive: string;
    name?: string;
}

interface Message {
    id: string;
    text: string;
    sender: "me" | "other" | string;
    timestamp: number;
    createdAt?: string;
}

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const fetchChats = () => {
        console.log("Fetching chats...");
        fetch(`${apiUrl}/api/chats`)
            .then((res) => {
                console.log("Fetch response status:", res.status);
                return res.json();
            })
            .then((data) => {
                console.log("Fetch data:", data);
                if (Array.isArray(data)) {
                    setConversations(data);
                }
            })
            .catch((err) => console.error("Failed to fetch chats:", err));
    };

    useEffect(() => {
        fetchChats();
    }, []);

    // Connect to Socket.IO
    useEffect(() => {
        const newSocket = io(socketUrl);

        newSocket.on("connect", () => {
            console.log("Admin connected to chat server");
        });

        newSocket.on("history", (history: any[]) => {
            if (!Array.isArray(history)) return;
            const formattedHistory = history.map((msg) => ({
                id: msg.id,
                text: msg.message,
                sender: msg.sender === "admin" ? "me" : "other", // Admin is 'me'
                timestamp: new Date(msg.createdAt).getTime(),
            }));
            setMessages(formattedHistory);
        });

        newSocket.on("message", (msg: any) => {
            const isMe = msg.sender === "admin";
            setMessages((prev) => [
                ...prev,
                {
                    id: msg.id || Date.now().toString(),
                    text: msg.message || msg.text,
                    sender: isMe ? "me" : "other",
                    timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
                },
            ]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Join room when selected
    useEffect(() => {
        if (socket && selectedRoomId) {
            socket.emit("join", selectedRoomId);
            setMessages([]); // Clear previous messages while loading
        }
    }, [selectedRoomId, socket]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!inputValue.trim() || !socket || !selectedRoomId) return;

        const messagePayload = {
            text: inputValue,
            roomId: selectedRoomId,
            sender: "admin",
        };

        socket.emit("message", messagePayload);
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
            {/* Sidebar: Conversation List */}
            <Card className="w-1/3 flex flex-col">
                <CardHeader className="border-b flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Active Conversations
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={fetchChats}>
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="flex flex-col">
                            {conversations.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedRoomId(chat.id)}
                                    className={`flex items-start gap-3 p-4 text-left hover:bg-muted transition-colors border-b ${selectedRoomId === chat.id ? "bg-muted" : ""
                                        }`}
                                >
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-medium truncate">{chat.name || `Guest ${chat.id.substring(0, 8)}...`}</div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {chat.lastMessage}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {conversations.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground">
                                    No active conversations
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Main Area: Chat Window */}
            <Card className="flex-1 flex flex-col">
                {selectedRoomId ? (
                    <>
                        <CardHeader className="border-b py-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Chat with {conversations.find(c => c.id === selectedRoomId)?.name || `Guest ${selectedRoomId.substring(0, 8)}...`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50/50">
                            <ScrollArea className="h-full p-4">
                                <div className="space-y-4">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm ${msg.sender === "me"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-white border"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type a reply..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="flex-1"
                                />
                                <Button onClick={sendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a conversation to start chatting
                    </div>
                )}
            </Card>
        </div>
    );
}
