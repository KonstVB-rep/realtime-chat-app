import mongoose, { Schema, Document, Types } from 'mongoose';

interface IChat extends Document {
  name: string,
  isGroup: boolean,
  avatar?:string,
  adminId: Types.ObjectId,
  participants:Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date,
}

export interface ChatResponse {
    id: string,
    name: string,
    isGroup:boolean,
    avatar?: string,
    adminId: string,
    participants: string[],
    createdAt: Date,
    updatedAt: Date,
}

const chatSchema = new Schema<IChat>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: null
  },
  adminId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
    timestamps: true,
    toJSON:{
        transform(_doc, ret): ChatResponse{
            return {
                id: ret._id.toString(),
                name: ret.name,
                isGroup:ret.isGroup,
                avatar: ret.avatar,
                adminId: ret.adminId.toString(),
                participants: ret.participants.map((id: Types.ObjectId) => id.toString()),
                createdAt: ret.createdAt,
                updatedAt: ret.updatedAt,
            }
        }
    }
})

chatSchema.index({ participants: 1 });

const Chat = mongoose.model<IChat>("Chat", chatSchema)

export default Chat;