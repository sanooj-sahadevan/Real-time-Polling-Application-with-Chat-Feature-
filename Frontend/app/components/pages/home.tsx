/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveChat, getMessages } from '@/services/userApi';
import io, { Socket } from "socket.io-client";

interface User {
    _id: string;
}

interface Message {
    user_id: string | undefined;
    user: string;
    text: string;
    createdAt: string;
    pollOptions?: string[];
    pollVotes?: number[];
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '', '', '']);
    const [isPoll, setIsPoll] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);






    useEffect(() => {
        const socketConnection = io('https://localhost:8000', {
            withCredentials: true,
        });

        socketConnection.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketConnection.on('message', (message) => {
            console.log('Received message:', message);
            setMessages(prevState => [...prevState, message]);
        });

        setSocket(socketConnection);

        return () => {
            if (socketConnection) {
                console.log('Disconnecting socket');
                socketConnection.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket && user) {
            const chatId = user._id; // or any other ID relevant to the chat room
            console.log(`Joining chat room: ${chatId}`);
            socket.emit("joinRoom", chatId); // Join room by chat ID
        }
    }, [socket, user]);





    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const response = await getMessages();
                console.log(response, 'get message');
                const messagesData: Message[] = response || [];
                setChatHistory(messagesData);
            } catch (error) {
                console.error('Failed to fetch chat details:', error);
                setChatHistory([]);
            }
        };

        fetchChatDetails();
    }, []);

    useEffect(() => {
        const storedUserProfile = localStorage.getItem('user');
        if (storedUserProfile) {
            try {
                const parsedUser = JSON.parse(storedUserProfile);
                setUser(parsedUser);
            } catch {
                toast.error('Error parsing user data from localStorage.');
            }
        }
    }, []);

    const sendMessageOrPoll = async () => {
        if (!user?._id || message.trim() === '') return;

        const chatData: any = {
            user: user._id,
            text: message,
            createdAt: new Date().toISOString(),
        };

        if (isPoll) {
            const validOptions = pollOptions.filter((option) => option.trim() !== '');
            if (validOptions.length < 2) {
                toast.error('Please add at least two options to create a poll.');
                return;
            }
            chatData.pollOptions = validOptions;
            chatData.pollVotes = Array(validOptions.length).fill(0);
        }

        // Optimistic Update
        setChatHistory((prev) => [...prev, chatData]);

        try {
            await saveChat(chatData);
            setMessage('');
            setPollQuestion('');
            setPollOptions(['', '', '', '']);
            setIsPoll(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message or poll.');
        }
    };
    console.log(chatHistory, 'po');

    return (

        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500">
            <div className="w-full max-w-6xl h-[90vh] p-12 bg-white rounded-xl shadow-lg ring-2 ring-teal-400 flex flex-col">
                <header className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white text-center font-bold text-3xl rounded-xl">
                    ChatMe
                </header>

                <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-gray-50 rounded-lg">
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className="flex space-x-4"
                        >
                            <div
                                className={`p-4 rounded-lg max-w-[85%] ${chat.user_id === user?._id ? 'bg-teal-600 text-white ml-auto' : 'bg-gray-800 text-white'}`}
                            >
                                <p className="font-semibold">{chat.user_id === user?._id ? 'You' : chat.user_id}</p>
                                <p>{chat.text}</p>
                                {chat.pollOptions && (
                                    <div className="mt-2">
                                        <p className="font-semibold">Poll:</p>
                                        {chat.pollOptions.map((option, idx) => (
                                            <p key={idx} className="text-sm">
                                                {option}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs mt-2 text-gray-300">
                                    {new Date(chat.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-white shadow-md flex flex-col space-y-6 rounded-lg">
                    {isPoll ? (
                        <div className="space-y-4">
                            <h3 className="font-bold text-teal-600">Create a Poll</h3>
                            <input
                                type="text"
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                placeholder="Enter poll question"
                                className="p-4 rounded-lg w-full mb-4 border border-teal-400 focus:ring-teal-500"
                            />
                            {pollOptions.map((option, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                        const newOptions = [...pollOptions];
                                        newOptions[index] = e.target.value;
                                        setPollOptions(newOptions);
                                    }}
                                    placeholder={`Option ${index + 1}`}
                                    className="p-4 rounded-lg w-full mb-4 border border-teal-400 focus:ring-teal-500"
                                />
                            ))}
                            <button
                                onClick={sendMessageOrPoll}
                                className="bg-teal-600 text-white p-4 rounded-lg w-full hover:bg-teal-700"
                            >
                                Send Poll
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-6">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="p-4 rounded-lg w-full h-24 resize-none bg-gray-100 border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                onClick={sendMessageOrPoll}
                                className="bg-teal-600 p-4 rounded-lg text-white hover:bg-teal-700"
                            >
                                Send
                            </button>
                            <button
                                onClick={() => setIsPoll(true)}
                                className="bg-yellow-500 p-4 rounded-lg text-white hover:bg-yellow-600"
                            >
                                Create Poll
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>



    );
}
