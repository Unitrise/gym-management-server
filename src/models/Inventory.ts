import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

const InventorySchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  description: { type: String }, // Optional field for additional details
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model<IInventory>('Inventory', InventorySchema);
