import mongoose, { Schema, Document } from 'mongoose';

interface ContractDocument extends Document {
  memberId: mongoose.Types.ObjectId;
  contractDetails: string;
  startDate: Date;
  endDate: Date;
}

const ContractSchema: Schema = new Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  contractDetails: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Contract = mongoose.model<ContractDocument>('Contract', ContractSchema);
export default Contract;
