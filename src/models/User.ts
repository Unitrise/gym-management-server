import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'member'; // Define specific roles for users
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'member'], default: 'member' }, // Set default role
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model<IUser>('User', UserSchema);
