"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    text: string;
    sender: "me" | "other" | string;
    timestamp: number;
}

interface Conversation {
    id: string;
    name: string;
    lastMessage: string;
    lastActive: string;
}

export function AdminChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations();
        checkServerHealth();
        // Poll for new conversations every 30 seconds
        const interval = setInterval(fetchConversations, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkServerHealth = async () => {
        try {
            const res = await fetch(`${apiUrl}/`);
            if (res.ok) {
                const text = await res.text();
                setServerStatus("ok");
                console.log("Backend health OK:", text);
                return true;
            }
        } catch (err) {
            console.warn("Backend health check failed:", err);
        }
        setServerStatus("down");
        return false;
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/chats`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
                // If we successfully fetched conversations, backend is up
                setServerStatus("ok");
            } else {
                console.warn("/api/chats returned status", res.status);
                setServerStatus("down");
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setServerStatus("down");
        }
    };

    const formatMessage = (msg: any): Message => ({
        id: msg.id || Date.now().toString(),
        text: msg.message || msg.text || "",
        sender: msg.sender === "admin" ? "me" : "other",
        timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
    });

    const fetchHistory = async (roomId: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/chats/${encodeURIComponent(roomId)}`);
            if (!res.ok) return;
            const history = await res.json();
            if (Array.isArray(history)) {
                setMessages(history.map(formatMessage));
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Connect to socket when a room is selected
    useEffect(() => {
        if (!selectedRoomId) return;

        setMessages([]);
        setSocketConnected(false);
        fetchHistory(selectedRoomId);

        // Disconnect previous socket if exists
        if (socket) {
            socket.disconnect();
        }

        const newSocket = io(socketUrl);

        newSocket.on("connect", () => {
            console.log("Admin connected to chat room:", selectedRoomId);
            setSocketConnected(true);
            newSocket.emit("join", selectedRoomId);
        });

        newSocket.on("disconnect", () => {
            setSocketConnected(false);
        });

        newSocket.on("history", (history: any[]) => {
            if (!Array.isArray(history)) return;

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
    }, [selectedRoomId]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text || !socket || !selectedRoomId) return;

        const messagePayload = {
            text,
            roomId: selectedRoomId,
            sender: "admin",
            name: "Admin",
        };

        socket.emit("message", messagePayload);
        setMessages((prev) => [
            ...prev,
            {
                id: `pending-${Date.now()}`,
                text,
                sender: "me",
                timestamp: Date.now(),
            },
        ]);
        setInputValue("");

        // Refresh conversation list to update last message/time
        fetchConversations();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversation List */}
            <Card className="col-span-1 border-0 shadow-lg flex flex-col h-full bg-white">
                <CardHeader className="border-b px-4 py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-prana-navy flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Percakapan Aktif
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={fetchConversations}>
                                Refresh
                            </Button>
                            <Button variant="ghost" size="sm" onClick={checkServerHealth}>
                                Diagnostics
                            </Button>
                            {serverStatus === 'ok' && <span className="text-xs text-green-600">Backend: OK</span>}
                            {serverStatus === 'down' && <span className="text-xs text-red-600">Backend: Down</span>}
                        </div>
                    </div>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                            {serverStatus === 'down' ? (
                                <>
                                    <div>Belum ada percakapan.</div>
                                    <div className="text-xs mt-2">Tip: Backend seems unreachable. Click <strong>Diagnostics</strong> or run the health check to verify the backend at <code>{apiUrl}</code>.</div>
                                </>
                            ) : (
                                <>
                                    <div>Belum ada percakapan</div>
                                    <div className="text-xs mt-2">Tip: If you already chatted from the site, ensure the user sent a message and the backend/socket servers are running.</div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedRoomId(conv.id)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedRoomId === conv.id ? "bg-blue-50 border-l-4 border-prana-blue" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-prana-navy truncate max-w-[120px]">
                                            {conv.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {conv.lastActive ? formatDistanceToNow(new Date(conv.lastActive), { addSuffix: true }) : ""}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="col-span-1 md:col-span-2 border-0 shadow-lg flex flex-col h-full bg-white">
                {selectedRoomId ? (
                    <>
                        <CardHeader className="border-b px-4 py-3 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-prana-blue/10 p-2 rounded-full">
                                    <User className="w-5 h-5 text-prana-blue" />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-prana-navy">
                                        {conversations.find(c => c.id === selectedRoomId)?.name || "User"}
                                    </CardTitle>
                                    <p className="text-xs text-gray-500">Room ID: {selectedRoomId}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <ScrollArea className="flex-1 p-4 bg-gray-50/30">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.sender === "me"
                                                ? "bg-prana-blue text-white rounded-br-none"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-400"
                                                }`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t flex gap-2 bg-white">
                            <Input
                                placeholder="Tulis pesan balasan..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="flex-1"
                            />
                            <Button onClick={sendMessage} disabled={!inputValue.trim() || !selectedRoomId} className="bg-prana-blue hover:bg-blue-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Pilih percakapan untuk memulai chat</p>
                        <p className="text-sm">Pilih salah satu user dari daftar di sebelah kiri</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
