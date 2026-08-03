import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    clerkId: string;
    email: string;
    fullName: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}

interface UserResponse {
    id: string;
    clerkId: string;
    email: string;
    fullName: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret): UserResponse {
            return {
                id: ret._id.toString(),
                clerkId: ret.clerkId,
                email: ret.email,
                fullName: ret.fullName,
                profilePic: ret.profilePic,
                createdAt: ret.createdAt,
                updatedAt: ret.updatedAt,
            };
        }
    }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;