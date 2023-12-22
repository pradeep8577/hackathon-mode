import { Schema, model } from 'mongoose';

export interface IChainAudit {
  id: string;
  PINECONE_ENV: string;
  PINECONE_API_KEY: string;
  auditorModel: string;
}

const ChainAuditSchema = new Schema<IChainAudit>({
  id: { type: String, required: true },
  PINECONE_ENV: { type: String, required: true },
  PINECONE_API_KEY: { type: String, required: true },
  auditorModel: { type: String, required: true },
});

export default model<IChainAudit>('ChainAudit', ChainAuditSchema, 'chainAudits');
