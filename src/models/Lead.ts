import mongoose, { Schema, Document } from 'mongoose';


export interface INote {
    message: string;
    date: Date;
    author: string;
}
// Interface representing the Lead document
export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    contactMethod: string;
    notes: INote[];
    interest: string;
    status: 'new' | 'in-progress' | 'closed';
    isConverted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const NoteSchema: Schema = new Schema({
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String }
  });
// Lead schema definition
const LeadSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    contactMethod: { type: String, required: true },  // e.g., 'Phone', 'Email', 'In-Person'
    notes: [NoteSchema],  // Embedded notes schema
    interest: { type: String, required: true },  // Area of interest (e.g., 'Gym Membership')
    status: { type: String, enum: ['new', 'in-progress', 'closed'], default: 'new' },  // Lead's current status
    isConverted: { type: Boolean, default: false },  // Has the lead been converted to a member?
    createdAt: { type: Date, default: Date.now },  // Automatically records creation date
    updatedAt: { type: Date, default: Date.now }   // Automatically updates when the lead is modified
});

// Middleware to update `updatedAt` before every save operation
LeadSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Export the Lead model
export default mongoose.model<ILead>('Lead', LeadSchema);
