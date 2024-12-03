'use client';

import { useState } from 'react';

export default function Home() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ user: string; message: string; pollOptions?: string[]; pollVotes?: number[] }[]>([]);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '', '', '']);
    const [isPoll, setIsPoll] = useState(false);

    // Send message handler
    const sendMessage = () => {
        if (message.trim() !== '') {
            setChatHistory((prev) => [...prev, { user: 'User', message }]);
            setMessage('');
        }
    };

    // Poll option change handler
    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    // Send poll handler
    const sendPoll = () => {
        if (pollQuestion.trim() && pollOptions.some((option) => option.trim())) {
            setChatHistory((prev) => [
                ...prev,
                { user: 'Admin', message: `Poll: ${pollQuestion}`, pollOptions, pollVotes: Array(pollOptions.length).fill(0) },
            ]);
            setPollQuestion('');
            setPollOptions(['', '', '', '']);
            setIsPoll(false);
        }
    };

    // Vote on a poll
    const handleVote = (index: number, pollIndex: number) => {
        const updatedHistory = [...chatHistory];
        const poll = updatedHistory[pollIndex];
        const updatedVotes = [...poll.pollVotes!];
        updatedVotes[index]++;
        updatedHistory[pollIndex] = { ...poll, pollVotes: updatedVotes };
        setChatHistory(updatedHistory);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500">
        <div className="w-full max-w-4xl h-[80vh] p-8 bg-white rounded-xl shadow-lg ring-2 ring-teal-400 flex flex-col">
            
            <header className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white text-center font-bold text-2xl rounded-xl">
                ChatMe
            </header>
    
            {/* Chat Box */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.user === 'Admin' ? 'justify-start' : 'justify-end'} space-x-2`}>
                        <div className={`p-3 rounded-lg ${chat.user === 'Admin' ? 'bg-gray-800' : 'bg-teal-600'} max-w-[80%]`}>
                            <p className="text-white">{chat.message}</p>
                            {chat.pollOptions && (
                                <div className="mt-2">
                                    {chat.pollOptions.map((option, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <button
                                                className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 w-full text-left"
                                                onClick={() => handleVote(idx, index)}
                                            >
                                                {option} - {chat.pollVotes?.[idx] || 0} votes
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
    
            {/* Input Box */}
            <div className="p-4 bg-white shadow-md flex flex-col space-y-4 rounded-lg h-24">
                {/* Poll Toggle */}
                {isPoll ? (
                    <div className="space-y-2">
                        <h3 className="font-bold text-teal-600">Create a Poll</h3>
                        <input
                            type="text"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder="Enter poll question"
                            className="p-3 rounded-lg w-full mb-2 border border-teal-400 focus:ring-teal-500"
                        />
                        {pollOptions.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="p-3 rounded-lg w-full mb-2 border border-teal-400 focus:ring-teal-500"
                            />
                        ))}
                        <button
                            onClick={sendPoll}
                            className="bg-teal-600 text-white p-3 rounded-lg w-full hover:bg-teal-700"
                        >
                            Send Poll
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="p-3 rounded-lg w-full h-20 resize-none bg-gray-100 border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-teal-600 p-3 rounded-lg text-white hover:bg-teal-700"
                        >
                            Send
                        </button>
                        <button
                            onClick={() => setIsPoll(true)}
                            className="bg-yellow-500 p-3 rounded-lg text-white hover:bg-yellow-600"
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
