import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  membership: {
    type: string;
    status: 'Active' | 'Inactive';
    startDate: Date;
    endDate: Date;
    renewalDate?: Date;
  };
  attendance: {
    checkIns: Array<{ date: Date, method: 'QR' | 'RFID' | 'Manual' }>;
    lastCheckIn: Date;
    totalCheckIns: number;
  };
  payments: {
    history: Array<{ date: Date, amount: number, method: string }>;
    nextDueDate: Date;
    recurringBilling: boolean;
  };
  progress: {
    fitnessGoals: string;
    milestones: Array<{ milestone: string, achieved: boolean, dateAchieved?: Date }>;
  };
  loyalty: {
    points: number;
    rewards: Array<{ rewardName: string, redeemed: boolean, dateRedeemed?: Date }>;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  membership: {
    type: { type: String, required: true },  // e.g., 'Standard', 'Premium'
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    renewalDate: { type: Date }
  },
  attendance: {
    checkIns: [{ date: { type: Date }, method: { type: String, enum: ['QR', 'RFID', 'Manual'] } }],
    lastCheckIn: { type: Date },
    totalCheckIns: { type: Number, default: 0 }
  },
  payments: {
    history: [{ date: { type: Date }, amount: { type: Number }, method: { type: String } }],
    nextDueDate: { type: Date },
    recurringBilling: { type: Boolean, default: false }
  },
  progress: {
    fitnessGoals: { type: String },
    milestones: [{ milestone: { type: String }, achieved: { type: Boolean, default: false }, dateAchieved: { type: Date } }]
  },
  loyalty: {
    points: { type: Number, default: 0 },
    rewards: [{ rewardName: { type: String }, redeemed: { type: Boolean, default: false }, dateRedeemed: { type: Date } }]
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to auto-update the `updatedAt` field
MemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IMember>('Member', MemberSchema);
