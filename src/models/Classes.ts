import mongoose, { Document, Schema } from 'mongoose';

// Define Class Schema
const ClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'Member' }], // Reference to Members
  description: { type: String },
});

// Define Class Model
export interface IClass extends Document {
  name: string;
  instructor: string;
  date: Date;
  time: string;
  capacity: number;
  attendees: string[];
  description?: string;
}

export default mongoose.model<IClass>('Class', ClassSchema);
