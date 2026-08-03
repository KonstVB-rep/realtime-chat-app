import mongoose, { Schema, Document, Types } from 'mongoose';

type MediaTypes = 'image' | 'video' | 'file';

interface IAttachment {
    type: MediaTypes;
    url: string;
    name?: string;
    size?: number;       
    width?: number;     
    height?: number;     
    duration?: number; 
}

interface IMessage extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text: string | null;
    attachments: IAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageResponse {
    id: string;
    senderId: string;
    receiverId: string;
    text: string | null;
    attachments: IAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    senderId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        default: null,
        trim: true,
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'video', 'file'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        name: String,
        size: Number
    }]
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret): MessageResponse {
            return {
                id: ret._id.toString(),
                senderId: ret.senderId.toString(),
                receiverId: ret.receiverId.toString(),
                text: ret.text,
                attachments: ret.attachments,
                createdAt: ret.createdAt,
                updatedAt: ret.updatedAt,
            };
        }
    }
});

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;