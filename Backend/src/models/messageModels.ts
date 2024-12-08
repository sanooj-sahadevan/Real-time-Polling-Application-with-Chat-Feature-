import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
    _id: Types.ObjectId;  // Type _id as ObjectId
    user_id: string;
    text: string;
    pollOptions?: string[];
    pollVotes?: number[];
    selectedPollOption?: string;
    createdAt: Date;
}

const messageSchema: Schema = new Schema(
    {
        user_id: { type: String, required: true },
        text: { type: String, required: true },
        pollOptions: { type: [String], default: [] },
        pollVotes: { type: [Number], default: [] },
        selectedPollOption: { type: String, default: null },
        createdAt: {type:Date, required: true}
    },
    { timestamps: true }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
