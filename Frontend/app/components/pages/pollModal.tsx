import React from 'react';

interface PollModalProps {
    pollOptions: string[];
    pollVotes: number[];
    onClose: () => void;
}

const PollModal: React.FC<PollModalProps> = ({ pollOptions, pollVotes, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-lg font-bold mb-4">Poll Details</h2>
                {pollOptions.map((option, index) => (
                    <p key={index} className="mb-2">
                        {option} - {pollVotes[index]} votes
                    </p>
                ))}
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PollModal;
