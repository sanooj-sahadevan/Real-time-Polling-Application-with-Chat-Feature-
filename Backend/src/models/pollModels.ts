import mongoose, { Schema, Document } from 'mongoose';

export interface IPoll extends Document {
    pollQuestion: string;
    pollOptions: string[];
    pollVotes: number[];
    createdAt: Date;
}

const pollSchema: Schema = new Schema(
    {
        pollQuestion: { type: String, required: true },
        pollOptions: { type: [String], required: true },
        pollVotes: { type: [Number], required: true },
    },
    { timestamps: true }
);

const Poll = mongoose.model<IPoll>('Poll', pollSchema);

export default Poll;
